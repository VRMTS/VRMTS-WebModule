import React, { useEffect, useRef, useState } from 'react';

export default function ModelTestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelInfo, setModelInfo] = useState<string>('');
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Load Three.js and FBXLoader from CDN
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initScene = async () => {
      try {
        // Load fflate (required by FBXLoader for decompression)
        await loadScript('https://cdn.jsdelivr.net/npm/fflate@0.7.4/umd/index.js');
        
        // Load Three.js
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
        
        // Load FBXLoader
        await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FBXLoader.js');

        const THREE = (window as any).THREE;
        
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x2a2a2a);
        
        // Camera
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
        camera.position.set(0, 100, 300);
        camera.lookAt(0, 0, 0);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight1.position.set(100, 100, 100);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight2.position.set(-100, 50, -100);
        scene.add(directionalLight2);

        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight3.position.set(0, -50, 0);
        scene.add(directionalLight3);

        // Grid helper for reference
        const gridHelper = new THREE.GridHelper(500, 50, 0x444444, 0x666666);
        scene.add(gridHelper);

        // Axes helper for reference
        const axesHelper = new THREE.AxesHelper(100);
        scene.add(axesHelper);

        // Load Model
        const loader = new (THREE as any).FBXLoader();
        const modelPath = '/models/SkeletalSystem100.fbx';
        
        let loadedModel: any = null;
        let originalMaterials = new Map();

        console.log('Starting to load model from:', modelPath);

        loader.load(
          modelPath,
          (fbx: any) => {
            console.log('✅ Model loaded successfully!');
            console.log('Model:', fbx);
            console.log('Children count:', fbx.children.length);

            // Get bounding box
            const box = new THREE.Box3().setFromObject(fbx);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            console.log('Bounding box center:', center);
            console.log('Bounding box size:', size);
            console.log('Max dimension:', Math.max(size.x, size.y, size.z));

            // Center the model
            fbx.position.sub(center);

            // Scale if needed
            const maxDim = Math.max(size.x, size.y, size.z);
            if (maxDim > 200) {
              const scale = 200 / maxDim;
              fbx.scale.setScalar(scale);
              console.log('Scaled model by:', scale);
            }

            // Make materials visible
            fbx.traverse((child: any) => {
              if (child.isMesh) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach((mat: any) => {
                  if (mat) {
                    // Store original material
                    originalMaterials.set(child.uuid, mat.clone());
                    
                    mat.side = THREE.DoubleSide;
                    if (mat.type === 'MeshPhongMaterial') {
                      mat.shininess = 30;
                      mat.needsUpdate = true;
                    }
                  }
                });
              }
            });

            scene.add(fbx);
            loadedModel = fbx;

            setModelInfo(`Loaded ${fbx.children.length} parts. Size: ${size.x.toFixed(1)} x ${size.y.toFixed(1)} x ${size.z.toFixed(1)}`);
            setIsLoading(false);
          },
          (xhr: any) => {
            const percent = xhr.total > 0 ? (xhr.loaded / xhr.total) * 100 : 0;
            setLoadingProgress(Math.round(percent));
            console.log(`Loading: ${percent.toFixed(2)}%`);
          },
          (error: any) => {
            console.error('❌ Error loading model:', error);
            setError(`Failed to load model: ${error.message || 'Unknown error'}`);
            setIsLoading(false);
          }
        );

        // Mouse controls
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let rotation = { x: 0, y: 0 };
        
        // Raycaster for picking
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let selectedMesh: any = null;

        const onMouseDown = (e: MouseEvent) => {
          isDragging = true;
          previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseMove = (e: MouseEvent) => {
          // Update mouse position for tooltip
          setMousePos({ x: e.clientX, y: e.clientY });
          
          if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            rotation.y += deltaX * 0.01;
            rotation.x += deltaY * 0.01;

            previousMousePosition = { x: e.clientX, y: e.clientY };
          } else if (loadedModel) {
            // Hover detection when not dragging
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(loadedModel.children, true);
            
            if (intersects.length > 0) {
              const hoveredMesh = intersects[0].object;
              const partName = hoveredMesh.name || 'Unnamed Part';
              setHoveredPart(partName);
              renderer.domElement.style.cursor = 'pointer';
            } else {
              setHoveredPart(null);
              renderer.domElement.style.cursor = 'default';
            }
          }
        };

        const onMouseUp = () => {
          isDragging = false;
        };
        
        const onClick = (e: MouseEvent) => {
          if (!loadedModel) return;
          
          const rect = renderer.domElement.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(loadedModel.children, true);
          
          if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            const partName = clickedMesh.name || 'Unnamed Part';
            
            // Reset previous selection
            if (selectedMesh && selectedMesh !== clickedMesh) {
              const originalMat = originalMaterials.get(selectedMesh.uuid);
              if (originalMat) {
                selectedMesh.material = originalMat.clone();
              }
            }
            
            // Highlight new selection
            if (selectedMesh !== clickedMesh) {
              selectedMesh = clickedMesh;
              setSelectedPart(partName);
              
              // Apply highlight material
              const highlightMat = new THREE.MeshPhongMaterial({
                color: 0x00ff00,
                emissive: 0x00aa00,
                shininess: 100,
                side: THREE.DoubleSide
              });
              clickedMesh.material = highlightMat;
            } else {
              // Deselect if clicking same part
              const originalMat = originalMaterials.get(selectedMesh.uuid);
              if (originalMat) {
                selectedMesh.material = originalMat.clone();
              }
              selectedMesh = null;
              setSelectedPart(null);
            }
            
            console.log('Clicked part:', partName);
            console.log('Part details:', clickedMesh);
          } else {
            // Clicked empty space - deselect
            if (selectedMesh) {
              const originalMat = originalMaterials.get(selectedMesh.uuid);
              if (originalMat) {
                selectedMesh.material = originalMat.clone();
              }
              selectedMesh = null;
              setSelectedPart(null);
            }
          }
        };

        const onWheel = (e: WheelEvent) => {
          e.preventDefault();
          camera.position.z += e.deltaY * 0.1;
          camera.position.z = Math.max(50, Math.min(800, camera.position.z));
        };

        renderer.domElement.addEventListener('mousedown', onMouseDown);
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('mouseup', onMouseUp);
        renderer.domElement.addEventListener('click', onClick);
        renderer.domElement.addEventListener('wheel', onWheel);

        // Animation loop
        let animationId: number;
        const animate = () => {
          animationId = requestAnimationFrame(animate);

          // Apply rotation to scene
          scene.rotation.y = rotation.y;
          scene.rotation.x = rotation.x;

          renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
          const width = container.clientWidth;
          const height = container.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
          cancelAnimationFrame(animationId);
          renderer.domElement.removeEventListener('mousedown', onMouseDown);
          renderer.domElement.removeEventListener('mousemove', onMouseMove);
          renderer.domElement.removeEventListener('mouseup', onMouseUp);
          renderer.domElement.removeEventListener('click', onClick);
          renderer.domElement.removeEventListener('wheel', onWheel);
          window.removeEventListener('resize', handleResize);
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
          renderer.dispose();
        };
      } catch (err) {
        console.error('Error initializing scene:', err);
        setError(`Failed to initialize 3D scene: ${err}`);
        setIsLoading(false);
      }
    };

    initScene();
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-800 relative">
      {/* Info Panel */}
      <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg z-10 max-w-sm">
        <h1 className="text-xl font-bold mb-2">3D Model Viewer</h1>
        <div className="text-sm space-y-1">
          <p>🖱️ <strong>Drag</strong> to rotate</p>
          <p>🖱️ <strong>Scroll</strong> to zoom</p>
          <p>👆 <strong>Click</strong> to select parts</p>
          {modelInfo && (
            <p className="mt-2 text-green-400">✅ {modelInfo}</p>
          )}
          {selectedPart && (
            <p className="mt-2 text-green-400">✨ Selected: {selectedPart}</p>
          )}
        </div>
      </div>

      {/* Hover Text - follows mouse */}
      {hoveredPart && (
        <div 
          className="absolute bg-blue-900 text-white text-sm font-semibold px-3 py-1.5 rounded pointer-events-none z-30"
          style={{
            left: `${mousePos.x + 15}px`,
            top: `${mousePos.y + 15}px`,
          }}
        >
          {hoveredPart}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95 z-20">
          <div className="text-center text-white">
            <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-bold mb-2">Loading 3D Model</p>
            <p className="text-4xl font-bold text-blue-400">{loadingProgress}%</p>
            <div className="w-64 h-3 bg-gray-800 rounded-full mt-4 overflow-hidden mx-auto">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-3">Loading SkeletalSystem100.fbx...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95 z-20">
          <div className="text-center text-white max-w-md px-6">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-xl font-bold mb-2">Failed to Load Model</p>
            <p className="text-sm text-gray-300">{error}</p>
            <p className="text-xs text-gray-400 mt-4">Check browser console for details</p>
          </div>
        </div>
      )}

      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Debug Info */}
      <div className="absolute bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-10">
        <p>Model: SkeletalSystem100.fbx</p>
        <p>Path: /models/SkeletalSystem100.fbx</p>
        <p className="text-gray-400 mt-1">Check console (F12) for logs</p>
      </div>
    </div>
  );
}