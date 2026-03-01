import React, { useEffect, useRef, useState } from 'react';
import { Layers, MessageSquare, Info, Brain } from 'lucide-react';

export default function ModelTestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelInfo, setModelInfo] = useState<string>('');
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [groupList, setGroupList] = useState<any[]>([]);
  const [explosionAmount, setExplosionAmount] = useState(0);
  const [selectedGroupForExplosion, setSelectedGroupForExplosion] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState(300);
  const sceneRef = useRef<any>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    if (initRef.current) return;
    initRef.current = true;

    const container = containerRef.current;
    
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
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
        await loadScript('https://cdn.jsdelivr.net/npm/fflate@0.7.4/umd/index.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FBXLoader.js');

        const THREE = (window as any).THREE;
        
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0f1e);
        
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
        camera.position.set(0, 100, 300);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
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

        const axesHelper = new THREE.AxesHelper(100);
        scene.add(axesHelper);

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

            const box = new THREE.Box3().setFromObject(fbx);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            fbx.position.set(-center.x, -center.y, -center.z);

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

            fbx.children.forEach((child: any) => {
              child.visible = false;
              child.traverse((subChild: any) => {
                subChild.visible = false;
              });
            });

            scene.add(fbx);
            loadedModel = fbx;
            
            camera.position.set(0, 100, 300);
            camera.lookAt(0, 0, 0);

            const groups: any[] = [];
            
            fbx.children.forEach((child: any) => {
              let meshCount = 0;
              let totalVerts = 0;
              child.traverse((subChild: any) => {
                if (subChild.isMesh) {
                  meshCount++;
                  totalVerts += subChild.geometry?.attributes?.position?.count || 0;
                }
              });
              
              groups.push({
                uuid: child.uuid,
                name: child.name || 'Unnamed Group',
                type: child.type,
                visible: false,
                childCount: child.children?.length || 0,
                meshCount: meshCount,
                totalVertices: totalVerts,
                isMesh: child.isMesh
              });
            });

            setGroupList(groups);

            sceneRef.current = {
              model: fbx,
              originalMaterials,
              selectedMesh: null,
              camera: camera,
              defaultCameraPos: new THREE.Vector3(0, 100, 300),
              defaultCameraTarget: new THREE.Vector3(0, 0, 0),
              originalPositions: new Map(),
              boundingCenters: new Map(),
              childOriginalPositions: new Map(),
              childBoundingCenters: new Map()
            };

            const storePositions = (obj: any, parentUuid: string = '') => {
              const key = parentUuid ? `${parentUuid}_${obj.uuid}` : obj.uuid;
              sceneRef.current.originalPositions.set(key, obj.position.clone());
              
              if (obj.isMesh || obj.isGroup) {
                const objBox = new THREE.Box3().setFromObject(obj);
                const objCenter = objBox.getCenter(new THREE.Vector3());
                sceneRef.current.boundingCenters.set(key, objCenter);
              }
              
              if (obj.children && obj.children.length > 0) {
                obj.children.forEach((child: any) => {
                  storePositions(child, obj.uuid);
                });
              }
            };

            fbx.children.forEach((child: any) => {
              storePositions(child);
            });

            setModelInfo(`${groups.length} top-level parts`);
            setIsLoading(false);
          },
          (xhr: any) => {
            const percent = xhr.total > 0 ? (xhr.loaded / xhr.total) * 100 : 0;
            setLoadingProgress(Math.round(percent));
          },
          (error: any) => {
            console.error(' Error loading model:', error);
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
            
            if (selectedMesh && selectedMesh !== clickedMesh) {
              const originalMat = originalMaterials.get(selectedMesh.uuid);
              if (originalMat) {
                selectedMesh.material = originalMat.clone();
              }
            }
            
            if (selectedMesh !== clickedMesh) {
              selectedMesh = clickedMesh;
              sceneRef.current.selectedMesh = selectedMesh;
              setSelectedPart(partName);
              
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
              sceneRef.current.selectedMesh = null;
              setSelectedPart(null);
            }
          } else {
            if (selectedMesh) {
              const originalMat = originalMaterials.get(selectedMesh.uuid);
              if (originalMat) {
                selectedMesh.material = originalMat.clone();
              }
              selectedMesh = null;
              sceneRef.current.selectedMesh = null;
              setSelectedPart(null);
            }
          }
        };

        const onWheel = (e: WheelEvent) => {
          e.preventDefault();
          const newZoom = Math.max(50, Math.min(800, camera.position.z + e.deltaY * 0.1));
          camera.position.z = newZoom;
          setZoomLevel(newZoom);
        };

        renderer.domElement.addEventListener('mousedown', onMouseDown);
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('mouseup', onMouseUp);
        renderer.domElement.addEventListener('click', onClick);
        renderer.domElement.addEventListener('wheel', onWheel);

        let animationId: number;
        const animate = () => {
          animationId = requestAnimationFrame(animate);
          scene.rotation.y = rotation.y;
          scene.rotation.x = rotation.x;
          renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
          const width = container.clientWidth;
          const height = container.clientHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

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

  const toggleVisibility = (uuid: string) => {
    if (!sceneRef.current) return;
    
    const targetChild = sceneRef.current.model.children.find((child: any) => child.uuid === uuid);
    if (targetChild) {
      const newVisibility = !targetChild.visible;
      targetChild.visible = newVisibility;
      
      targetChild.traverse((child: any) => {
        child.visible = newVisibility;
      });
      
      setGroupList(prev => prev.map(g => 
        g.uuid === uuid ? {...g, visible: newVisibility} : g
      ));
    }
  };

  const showOnlyThis = (uuid: string) => {
    if (!sceneRef.current) return;
    const THREE = (window as any).THREE;
    
    let targetChild = null;
    
    sceneRef.current.model.children.forEach((child: any) => {
      const shouldBeVisible = (child.uuid === uuid);
      child.visible = shouldBeVisible;
      
      if (shouldBeVisible) {
        targetChild = child;
      }
      
      child.traverse((subChild: any) => {
        subChild.visible = shouldBeVisible;
      });
    });
    
    if (targetChild && sceneRef.current.camera) {
      const box = new THREE.Box3().setFromObject(targetChild);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = sceneRef.current.camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 2.0;
      
      sceneRef.current.camera.position.set(center.x, center.y, center.z + cameraZ);
      sceneRef.current.camera.lookAt(center);
      setZoomLevel(center.z + cameraZ);
    }
    
    setGroupList(prev => prev.map(g => ({...g, visible: g.uuid === uuid})));
  };

  const showAll = () => {
    if (!sceneRef.current) return;
    
    sceneRef.current.model.children.forEach((child: any) => {
      child.visible = true;
      
      child.traverse((subChild: any) => {
        subChild.visible = true;
      });
    });
    
    if (sceneRef.current.camera && sceneRef.current.defaultCameraPos) {
      sceneRef.current.camera.position.copy(sceneRef.current.defaultCameraPos);
      sceneRef.current.camera.lookAt(sceneRef.current.defaultCameraTarget);
      setZoomLevel(300);
    }
    
    setGroupList(prev => prev.map(g => ({...g, visible: true})));
  };

  const hideAll = () => {
    if (!sceneRef.current) return;
    
    sceneRef.current.model.children.forEach((child: any) => {
      child.visible = false;
      
      child.traverse((subChild: any) => {
        subChild.visible = false;
      });
    });
    
    setGroupList(prev => prev.map(g => ({...g, visible: false})));
  };

  const handleExplosion = (value: number) => {
    if (!sceneRef.current) return;
    const THREE = (window as any).THREE;
    
    setExplosionAmount(value);
    
    const resetPositions = (obj: any, parentUuid: string = '') => {
      const key = parentUuid ? `${parentUuid}_${obj.uuid}` : obj.uuid;
      
      const originalPos = sceneRef.current.originalPositions.get(key);
      if (originalPos) {
        obj.position.copy(originalPos);
      }
      
      if (obj.children) {
        obj.children.forEach((child: any) => resetPositions(child, obj.uuid));
      }
    };
    
    sceneRef.current.model.children.forEach((child: any) => {
      resetPositions(child, ''); 
    });
    
    if (value === 0) return;
    
    if (selectedGroupForExplosion === 'ALL') {
      const modelCenter = new THREE.Vector3(-4.30, 86.03, -0.71); 
      
      sceneRef.current.model.children.forEach((child: any) => {
        const originalPos = sceneRef.current.originalPositions.get(child.uuid);
        const boundingCenter = sceneRef.current.boundingCenters.get(child.uuid);
        
        if (!originalPos || !boundingCenter) return;
        
        const direction = new THREE.Vector3()
          .subVectors(boundingCenter, modelCenter)
          .normalize();
        
        if (direction.lengthSq() < 0.0001) {
          direction.set(0, 1, 0);
        }
        
        const offset = direction.multiplyScalar(value * 0.05);
        child.position.copy(originalPos).add(offset);
      });

    } else {
      const targetGroup = sceneRef.current.model.children.find((c: any) => c.uuid === selectedGroupForExplosion);
      
      if (!targetGroup) return;
      
      const groupBox = new THREE.Box3().setFromObject(targetGroup);
      const groupCenter = groupBox.getCenter(new THREE.Vector3());
      
      const meshes: any[] = [];
      targetGroup.traverse((child: any) => {
        if (child.isMesh) {
          meshes.push(child);
        }
      });
      
      if (meshes.length === 0) return;
      
      meshes.forEach((mesh: any, index: number) => {
        const meshBox = new THREE.Box3().setFromObject(mesh);
        const meshCenter = meshBox.getCenter(new THREE.Vector3());
        
        let direction = new THREE.Vector3()
          .subVectors(meshCenter, groupCenter)
          .normalize();
        
        if (direction.lengthSq() < 0.0001) { //fibosphere
          const phi = Math.acos(-1 + (2 * index) / meshes.length);
          const theta = Math.sqrt(meshes.length * Math.PI) * phi;
          direction.set(
            Math.cos(theta) * Math.sin(phi),
            Math.sin(theta) * Math.sin(phi),
            Math.cos(phi)
          ).normalize();
        }
        
        let key = mesh.uuid;
        if (mesh.parent) {
             key = `${mesh.parent.uuid}_${mesh.uuid}`;
        }
        
        const originalPos = sceneRef.current.originalPositions.get(key);
        
        if (originalPos) {
          const offset = direction.multiplyScalar(value * 0.025); 
          mesh.position.copy(originalPos).add(offset);
        }
      });
    }
  };

  const handleZoomChange = (value: number) => {
    if (!sceneRef.current?.camera) return;
    setZoomLevel(value);
    sceneRef.current.camera.position.z = value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">Skeletal System</h1>
              <p className="text-slate-400 text-sm">Explore the human skeleton in 3D</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-800/50 rounded-lg px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-sm">Progress: 0%</span>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium text-sm hover:from-cyan-400 hover:to-teal-400 transition-all">
                Take Quiz
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Model Parts */}
          <div className="col-span-3 space-y-4">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Model Parts ({groupList.length})
              </h3>
              
              <div className="space-y-2 mb-4">
                <button
                  onClick={showAll}
                  className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm shadow-lg"
                >
                  SHOW ALL PARTS
                </button>
                
                <button
                  onClick={hideAll}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm shadow-lg"
                >
                  HIDE ALL PARTS
                </button>
              </div>
              
              <p className="text-xs text-slate-400 mb-3 text-center">All parts start hidden. Click SHOW to reveal them.</p>
              
              {/* Explosion Controls */}
              <div className="mb-4 bg-gradient-to-br from-slate-800/80 to-slate-800/40 p-4 rounded-lg border border-white/5">
                <label className="block text-xs font-bold mb-3 text-cyan-400 uppercase tracking-wide">
                  🎆 Exploded View
                </label>
                
                <select
                  value={selectedGroupForExplosion}
                  onChange={(e) => {
                    setSelectedGroupForExplosion(e.target.value);
                    handleExplosion(explosionAmount);
                  }}
                  className="w-full bg-slate-700/80 text-white px-3 py-2 rounded-lg mb-3 text-xs font-medium border border-white/10 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="ALL">🌍 All Parts</option>
                  {groupList.filter(g => !g.isMesh).map((group) => (
                    <option key={group.uuid} value={group.uuid}>
                      {group.name}
                    </option>
                  ))}
                </select>
                
                <div className="mb-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={explosionAmount}
                    onChange={(e) => handleExplosion(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    style={{
                      background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${explosionAmount}%, #334155 ${explosionAmount}%, #334155 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">Together</span>
                  <span className="text-sm font-bold text-cyan-400">{explosionAmount}</span>
                  <span className="text-[10px] text-slate-500">Apart</span>
                </div>
              </div>
              
              <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
                <span>Click SHOW to reveal parts</span>
                <span className="text-cyan-400 font-semibold">{groupList.filter(g => g.visible).length}/{groupList.length} visible</span>
              </div>
              
              {/* Parts List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(6, 182, 212, 0.5) rgba(30, 41, 59, 0.5)'
              }}>
                {groupList.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    {isLoading ? 'Loading parts...' : 'No parts found'}
                  </div>
                ) : (
                  groupList.map((group) => (
                    <div
                      key={group.uuid}
                      className="bg-slate-800/60 p-3 rounded-lg hover:bg-slate-800 transition-all border border-white/5"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs truncate text-white">{group.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {group.meshCount} meshes • {group.totalVertices.toLocaleString()} verts
                          </div>
                        </div>
                        <div className={`ml-2 w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
                          group.visible ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => showOnlyThis(group.uuid)}
                          className="flex-1 px-2 py-1.5 rounded-md text-[11px] bg-purple-600/80 hover:bg-purple-600 font-semibold transition-all"
                        >
                          ONLY
                        </button>
                        <button
                          onClick={() => toggleVisibility(group.uuid)}
                          className={`flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                            group.visible 
                              ? 'bg-green-600/80 hover:bg-green-600' 
                              : 'bg-red-600/80 hover:bg-red-600'
                          }`}
                        >
                          {group.visible ? 'HIDE' : 'SHOW'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Center - 3D Viewer */}
          <div className="col-span-6 relative">
            {/* Hover Tooltip */}
            {hoveredPart && (
              <div 
                className="fixed bg-slate-900/95 backdrop-blur-sm border border-cyan-400/50 text-white text-sm font-semibold px-3 py-1.5 rounded pointer-events-none z-30"
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
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-20 rounded-2xl">
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
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-20 rounded-2xl">
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

            <div ref={containerRef} className="w-full h-[600px] rounded-2xl overflow-hidden" />
            
            {/* Zoom Control Slider */}
            <div className="mt-4 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-cyan-400 uppercase tracking-wide flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  Zoom Level
                </label>
                <span className="text-sm font-bold text-cyan-400">{Math.round((800 - zoomLevel) / 7.5)}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                value={zoomLevel}
                onChange={(e) => handleZoomChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                style={{
                  background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((800 - zoomLevel) / 750) * 100}%, #334155 ${((800 - zoomLevel) / 750) * 100}%, #334155 100%)`
                }}
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-slate-500">Far</span>
                <span className="text-[10px] text-slate-400">Scroll wheel also works</span>
                <span className="text-[10px] text-slate-500">Close</span>
              </div>
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

            {/* Information Panel */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                Information
              </h3>
              <p className="text-sm text-slate-400">
                {selectedPart 
                  ? `Selected: ${selectedPart}` 
                  : hoveredPart 
                  ? `Hovering over: ${hoveredPart}` 
                  : 'Click on any part of the model to learn more about it.'}
              </p>
            </div>

            {/* Study Tips */}
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl p-4">
              <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                Study Tip
              </h3>
              <p className="text-xs text-slate-300">
                Use the exploded view slider to separate parts and understand their spatial relationships. Try exploring individual bone groups!
              </p>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}




