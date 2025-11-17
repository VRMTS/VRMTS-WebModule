import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, ChevronRight, Maximize2, Eye, EyeOff,
  Layers, BookOpen, MessageSquare, Bookmark, Share2, Flag, Info,
  X, ChevronLeft, Play, FileText, Activity, Brain
} from 'lucide-react';

interface AnatomyPart {
  id: number;
  name: string;
  description: string;
  related: string[];
}

interface Layer {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Section {
  id: number;
  name: string;
  parts: number;
}

interface BookmarkItem {
  name: string;
  rotation: { x: number; y: number };
}

// Track if Three.js scripts are loaded globally (only load once)
let scriptsLoaded = false;
let scriptLoadingPromise: Promise<void> | null = null;

export default function ModuleExploration() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  
  // UI State
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [selectedPart, setSelectedPart] = useState<AnatomyPart | null>(null);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [anatomyParts, setAnatomyParts] = useState<AnatomyPart[]>([]);
  
  // 3D Viewer State
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPartName, setHoveredPartName] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const layers: Layer[] = [
    { id: 'all', name: 'All Layers', icon: Layers, color: 'from-cyan-500 to-teal-500' },
    { id: 'skeletal', name: 'Skeletal', icon: Activity, color: 'from-slate-400 to-slate-500' },
    { id: 'muscular', name: 'Muscular', icon: Activity, color: 'from-red-500 to-rose-500' },
    { id: 'nervous', name: 'Nervous', icon: Brain, color: 'from-yellow-500 to-amber-500' },
    { id: 'vascular', name: 'Vascular', icon: Activity, color: 'from-blue-500 to-indigo-500' }
  ];

  const sections: Section[] = [
    { id: 1, name: 'Overview', parts: 12 },
    { id: 2, name: 'Axial Skeleton', parts: 28 },
    { id: 3, name: 'Appendicular Skeleton', parts: 32 },
    { id: 4, name: 'Joints & Articulations', parts: 18 },
    { id: 5, name: 'Bone Structure', parts: 8 }
  ];

  const bookmarks: BookmarkItem[] = [
    { name: 'Anterior View', rotation: { x: 0, y: 0 } },
    { name: 'Posterior View', rotation: { x: 0, y: 180 } },
    { name: 'Lateral View', rotation: { x: 0, y: 90 } }
  ];

  const handlePartClick = (partName: string) => {
    let part = anatomyParts.find(p => p.name === partName);
    
    if (!part) {
      part = {
        id: anatomyParts.length + 1,
        name: partName,
        description: `Exploring ${partName}. Click "Learn More" for detailed information.`,
        related: []
      };
      setAnatomyParts([...anatomyParts, part]);
    }
    
    setSelectedPart(part);
  };

  // 3D Viewer Initialization
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let isMounted = true;
    
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadScriptsOnce = async () => {
      if (scriptsLoaded) return;
      
      if (scriptLoadingPromise) {
        return scriptLoadingPromise;
      }
      
      scriptLoadingPromise = (async () => {
        await loadScript('https://cdn.jsdelivr.net/npm/fflate@0.7.4/umd/index.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FBXLoader.js');
        scriptsLoaded = true;
      })();
      
      return scriptLoadingPromise;
    };

    const initScene = async () => {
      try {
        await loadScriptsOnce();
        
        if (!isMounted) return;

        const THREE = (window as any).THREE;
        
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f172a);
        
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
        camera.position.set(0, 100, 300);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          preserveDrawingBuffer: false
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

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

        const gridHelper = new THREE.GridHelper(500, 50, 0x334155, 0x1e293b);
        scene.add(gridHelper);

        const loader = new (THREE as any).FBXLoader();
        let loadedModel: any = null;
        let originalMaterials = new Map();

        loader.load(
          '/models/SkeletalSystem100.fbx',
          (fbx: any) => {
            if (!isMounted) return;
            
            const box = new THREE.Box3().setFromObject(fbx);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            fbx.position.sub(center);

            const maxDim = Math.max(size.x, size.y, size.z);
            if (maxDim > 200) {
              const scale = 200 / maxDim;
              fbx.scale.setScalar(scale);
            }

            fbx.traverse((child: any) => {
              if (child.isMesh) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach((mat: any) => {
                  if (mat) {
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
            setIsLoading(false);
          },
          (xhr: any) => {
            if (!isMounted) return;
            const percent = xhr.total > 0 ? (xhr.loaded / xhr.total) * 100 : 0;
            setLoadingProgress(Math.round(percent));
          },
          (error: any) => {
            if (!isMounted) return;
            setError(`Failed to load model: ${error.message || 'Unknown error'}`);
            setIsLoading(false);
          }
        );

        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let rotation = { x: 0, y: 0 };
        
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let selectedMesh: any = null;

        const onMouseDown = (e: MouseEvent) => {
          isDragging = true;
          previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseMove = (e: MouseEvent) => {
          if (!isMounted) return;
          
          setMousePos({ x: e.clientX, y: e.clientY });
          
          if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            rotation.y += deltaX * 0.01;
            rotation.x += deltaY * 0.01;

            previousMousePosition = { x: e.clientX, y: e.clientY };
          } else if (loadedModel) {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(loadedModel.children, true);
            
            if (intersects.length > 0) {
              const hoveredMesh = intersects[0].object;
              const partName = hoveredMesh.name || 'Unnamed Part';
              setHoveredPartName(partName);
              renderer.domElement.style.cursor = 'pointer';
            } else {
              setHoveredPartName(null);
              renderer.domElement.style.cursor = 'default';
            }
          }
        };

        const onMouseUp = () => {
          isDragging = false;
        };
        
        const onClick = (e: MouseEvent) => {
          if (!loadedModel || !isMounted) return;
          
          const rect = renderer.domElement.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(loadedModel.children, true);
          
          if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            const partName = clickedMesh.name || 'Unnamed Part';
            
            if (selectedMesh && selectedMesh !== clickedMesh) {
              const originalMat = originalMaterials.get(selectedMesh.uuid);
              if (originalMat) {
                selectedMesh.material = originalMat.clone();
              }
            }
            
            if (selectedMesh !== clickedMesh) {
              selectedMesh = clickedMesh;
              handlePartClick(partName);
              
              const highlightMat = new THREE.MeshPhongMaterial({
                color: 0x06b6d4,
                emissive: 0x0891b2,
                shininess: 100,
                side: THREE.DoubleSide
              });
              clickedMesh.material = highlightMat;
            } else {
              const originalMat = originalMaterials.get(selectedMesh.uuid);
              if (originalMat) {
                selectedMesh.material = originalMat.clone();
              }
              selectedMesh = null;
            }
          } else {
            if (selectedMesh) {
              const originalMat = originalMaterials.get(selectedMesh.uuid);
              if (originalMat) {
                selectedMesh.material = originalMat.clone();
              }
              selectedMesh = null;
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
        renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

        let animationId: number;
        const animate = () => {
          if (!isMounted) return;
          animationId = requestAnimationFrame(animate);
          scene.rotation.y = rotation.y;
          scene.rotation.x = rotation.x;
          renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
          if (!isMounted) return;
          const width = container.clientWidth;
          const height = container.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        cleanupRef.current = () => {
          isMounted = false;
          
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
          
          renderer.domElement.removeEventListener('mousedown', onMouseDown);
          renderer.domElement.removeEventListener('mousemove', onMouseMove);
          renderer.domElement.removeEventListener('mouseup', onMouseUp);
          renderer.domElement.removeEventListener('click', onClick);
          renderer.domElement.removeEventListener('wheel', onWheel);
          window.removeEventListener('resize', handleResize);
          
          originalMaterials.forEach((mat) => {
            if (mat.dispose) mat.dispose();
          });
          originalMaterials.clear();
          
          if (loadedModel) {
            loadedModel.traverse((child: any) => {
              if (child.isMesh) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                  if (Array.isArray(child.material)) {
                    child.material.forEach((mat: any) => mat.dispose());
                  } else {
                    child.material.dispose();
                  }
                }
              }
            });
            scene.remove(loadedModel);
          }
          
          scene.traverse((object: any) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((mat: any) => mat.dispose());
              } else {
                object.material.dispose();
              }
            }
          });
          
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
          
          renderer.dispose();
          renderer.forceContextLoss();
          
          loadedModel = null;
          selectedMesh = null;
        };
        
      } catch (err) {
        if (!isMounted) return;
        setError(`Failed to initialize 3D scene: ${err}`);
        setIsLoading(false);
      }
    };

    initScene();

    return () => {
      isMounted = false;
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/modules')}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold">
                <span className="text-white">VRMTS</span>
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Home className="w-4 h-4 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => navigate('/studentdashboard')} />
                <ChevronRight className="w-4 h-4" />
                <span>Modules</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-cyan-400">Skeletal System</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-slate-800/50 rounded-lg px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-sm">Progress: 0%</span>
              </div>
              <button
                onClick={() => navigate('/quizselection')}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium text-sm hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Take Quiz
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Skeletal System</h2>
              <p className="text-slate-400 text-sm">Explore the human skeleton in 3D</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Bookmark">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Share">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Report Issue">
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-2 space-y-4">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Sections
              </h3>
              <div className="space-y-1">
                {sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(idx)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === idx
                        ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 text-cyan-400'
                        : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{section.name}</span>
                      <span className="text-xs text-slate-500">{section.parts}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-3 text-sm">Saved Views</h3>
              <div className="space-y-2">
                {bookmarks.map((bookmark: BookmarkItem, idx: number) => (
                  <button
                    key={idx}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-all flex items-center gap-2"
                  >
                    <Bookmark className="w-3 h-3 text-cyan-400" />
                    {bookmark.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - 3D Viewer */}
          <div className="col-span-7 space-y-4">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
              <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-900 to-slate-950">
                {/* Hover Tooltip */}
                {hoveredPartName && (
                  <div 
                    className="absolute bg-slate-900/95 backdrop-blur-sm border border-cyan-400/50 text-white text-sm font-semibold px-3 py-1.5 rounded pointer-events-none z-30"
                    style={{
                      left: `${mousePos.x + 15}px`,
                      top: `${mousePos.y + 15}px`,
                    }}
                  >
                    {hoveredPartName}
                  </div>
                )}

                {/* Loading Overlay */}
                {isLoading && !error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/95 z-20">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-lg font-bold mb-2">Loading 3D Model</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">{loadingProgress}%</p>
                      <div className="w-64 h-2 bg-slate-800 rounded-full mt-4 overflow-hidden mx-auto">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-300"
                          style={{ width: `${loadingProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Overlay */}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/95 z-20">
                    <div className="text-center text-white max-w-md px-6">
                      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-lg font-bold mb-2">Failed to Load Model</p>
                      <p className="text-sm text-slate-300">{error}</p>
                    </div>
                  </div>
                )}

                <div ref={containerRef} className="w-full h-full" />
              </div>

              {/* Control Panel */}
              <div className="border-t border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>Drag to rotate • Scroll to zoom • Click to select</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowLabels(!showLabels)}
                      className={`p-2 rounded-lg transition-colors ${
                        showLabels ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/5'
                      }`}
                      title="Toggle Labels"
                    >
                      {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button 
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setShowNotes(!showNotes)}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      title="Notes"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Layer Selection */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400 font-medium">Layers:</span>
              {layers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    selectedLayer === layer.id
                      ? `bg-gradient-to-r ${layer.color} text-white shadow-lg`
                      : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <layer.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{layer.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-4">
            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">AI Assistant</h4>
                  <p className="text-xs text-slate-400">Ask me anything</p>
                </div>
              </div>
              <input 
                type="text"
                placeholder="What is the function of the femur?"
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50"
              />
            </div>

            {/* Selected Part Info */}
            {selectedPart ? (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 animate-in fade-in">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Info className="w-4 h-4 text-cyan-400" />
                    {selectedPart.name}
                  </h3>
                  <button onClick={() => setSelectedPart(null)} className="p-1 hover:bg-white/5 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-sm text-slate-300 mb-4">{selectedPart.description}</p>
                
                {selectedPart.related.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-400 mb-2">Related Structures</h4>
                    <div className="space-y-1">
                      {selectedPart.related.map((rel, idx) => (
                        <button key={idx} className="w-full text-left px-2 py-1 rounded text-xs hover:bg-white/5 transition-colors text-cyan-400">
                          → {rel}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button className="w-full py-2 px-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg text-sm font-medium hover:from-cyan-400 hover:to-teal-400 transition-all">
                  Learn More
                </button>
              </div>
            ) : (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  Information
                </h3>
                <p className="text-sm text-slate-400">
                  {hoveredPartName 
                    ? `Hovering over: ${hoveredPartName}` 
                    : 'Click on any part of the model to learn more about it.'}
                </p>
              </div>
            )}

            {/* Explored Parts */}
            {anatomyParts.length > 0 && (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="font-semibold mb-3 text-sm">Explored Parts</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {anatomyParts.map((part) => (
                    <button
                      key={part.id}
                      onClick={() => setSelectedPart(part)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedPart?.id === part.id
                          ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                          : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      {part.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Study Tips */}
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl p-4">
              <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                Study Tip
              </h3>
              <p className="text-xs text-slate-300">
                Try rotating the model to view from different angles. Understanding spatial relationships is key to mastering anatomy!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">My Notes</h3>
              <button onClick={() => setShowNotes(false)} className="p-2 hover:bg-white/5 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea 
              className="w-full h-64 bg-slate-950 border border-white/10 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-cyan-400/50"
              placeholder="Take notes about this module..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowNotes(false)} className="px-4 py-2 hover:bg-white/5 rounded-lg transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium hover:from-cyan-400 hover:to-teal-400 transition-all">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}