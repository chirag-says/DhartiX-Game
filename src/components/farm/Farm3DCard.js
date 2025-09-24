import React, { useEffect, useRef, useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import "./Farm3DCard.css";

/**
 * Farm3DCard - Interactive 3D Farm Game Component
 * Based on the three-farm-deploy architecture using Three.js for 3D rendering
 */
const Farm3DCard = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationIdRef = useRef(null);

  const [gameState, setGameState] = useState({
    money: 10000,
    selectedTool: "select",
    farmLevel: 1,
    crops: [],
    buildings: [],
    isLoading: true,
  });

  const [playerStats, setPlayerStats] = useState({
    name: "Farmer",
    avatar: 1,
    level: 1,
    experience: 0,
  });

  const [selectedItem, setSelectedItem] = useState(null);
  const [showStore, setShowStore] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  // Game tools similar to three-farm-deploy
  const tools = [
    { id: "select", name: "Select", icon: "👆", color: "#4CAF50" },
    { id: "plant", name: "Plant", icon: "🌱", color: "#8BC34A" },
    { id: "water", name: "Water", icon: "💧", color: "#2196F3" },
    { id: "harvest", name: "Harvest", icon: "🎯", color: "#FF9800" },
    { id: "build", name: "Build", icon: "🏠", color: "#9C27B0" },
    { id: "bulldoze", name: "Remove", icon: "🚚", color: "#F44336" },
  ];

  // Store items similar to three-farm-deploy
  const storeItems = [
    {
      id: "corn",
      name: "Corn",
      price: 50,
      type: "crop",
      icon: "🌽",
      model: "corn.glb",
    },
    {
      id: "wheat",
      name: "Wheat",
      price: 30,
      type: "crop",
      icon: "🌾",
      model: "wheat.glb",
    },
    {
      id: "tomato",
      name: "Tomato",
      price: 80,
      type: "crop",
      icon: "🍅",
      model: "tomato.glb",
    },
    {
      id: "barn",
      name: "Barn",
      price: 500,
      type: "building",
      icon: "🏠",
      model: "barn.glb",
    },
    {
      id: "silo",
      name: "Silo",
      price: 300,
      type: "building",
      icon: "🏭",
      model: "silo.glb",
    },
    {
      id: "fence",
      name: "Fence",
      price: 20,
      type: "decoration",
      icon: "🚪",
      model: "fence.glb",
    },
  ];

  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      initializeThreeJS();
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const initializeThreeJS = async () => {
    try {
      // Dynamically import Three.js to avoid SSR issues
      const THREE = await import("three");
      const { GLTFLoader } = await import(
        "three/examples/jsm/loaders/GLTFLoader"
      );
      const { OrbitControls } = await import(
        "three/examples/jsm/controls/OrbitControls"
      );

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87ceeb); // Sky blue
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        canvasRef.current.clientWidth / canvasRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(10, 15, 10);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
      });
      renderer.setSize(
        canvasRef.current.clientWidth,
        canvasRef.current.clientHeight
      );
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // Lighting setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 20, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      // Ground plane
      const groundGeometry = new THREE.PlaneGeometry(50, 50);
      const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x8fbc8f });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // Farm grid overlay
      const gridHelper = new THREE.GridHelper(50, 25, 0x000000, 0x000000);
      gridHelper.material.opacity = 0.2;
      gridHelper.material.transparent = true;
      scene.add(gridHelper);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2.2; // Prevent camera from going below ground

      // Add some initial farm elements
      addInitialFarmElements(scene, THREE);

      // Animation loop
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Handle window resize
      const handleResize = () => {
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener("resize", handleResize);

      setGameState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error("Failed to initialize 3D farm:", error);
      setGameState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const addInitialFarmElements = (scene, THREE) => {
    // Add some basic farm structures

    // Farmhouse
    const houseGeometry = new THREE.BoxGeometry(3, 2, 3);
    const houseMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const house = new THREE.Mesh(houseGeometry, houseMaterial);
    house.position.set(-10, 1, -10);
    house.castShadow = true;
    scene.add(house);

    // Roof
    const roofGeometry = new THREE.ConeGeometry(2.5, 1, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(-10, 2.5, -10);
    roof.rotation.y = Math.PI / 4;
    scene.add(roof);

    // Some crops
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (Math.random() > 0.6) {
          const cropGeometry = new THREE.ConeGeometry(0.2, 0.8, 4);
          const cropMaterial = new THREE.MeshLambertMaterial({
            color: 0x228b22,
          });
          const crop = new THREE.Mesh(cropGeometry, cropMaterial);
          crop.position.set(i * 2 - 4, 0.4, j * 2 - 4);
          crop.castShadow = true;
          scene.add(crop);
        }
      }
    }

    // Trees around the farm
    for (let i = 0; i < 8; i++) {
      const treeGeometry = new THREE.ConeGeometry(1, 3, 6);
      const treeMaterial = new THREE.MeshLambertMaterial({ color: 0x006400 });
      const tree = new THREE.Mesh(treeGeometry, treeMaterial);
      const angle = (i / 8) * Math.PI * 2;
      tree.position.set(Math.cos(angle) * 20, 1.5, Math.sin(angle) * 20);
      tree.castShadow = true;
      scene.add(tree);
    }
  };

  const handleToolSelect = (toolId) => {
    setGameState((prev) => ({ ...prev, selectedTool: toolId }));
  };

  const handleStoreToggle = () => {
    setShowStore(!showStore);
  };

  const handleItemPurchase = (item) => {
    if (gameState.money >= item.price) {
      setGameState((prev) => ({
        ...prev,
        money: prev.money - item.price,
      }));
      // Add item to scene or inventory logic here
      console.log(`Purchased ${item.name} for $${item.price}`);
    }
  };

  return (
    <Card className="farm3d-card">
      <div className="farm3d-header">
        <div className="farm-info">
          <h2 className="farm3d-title">🚜 3D Interactive Farm</h2>
          <div className="farm-stats">
            <span className="money">💰 ${gameState.money}</span>
            <span className="level">⭐ Level {gameState.farmLevel}</span>
            <span className="player">👨‍🌾 {playerStats.name}</span>
          </div>
        </div>
      </div>

      <div className="farm3d-container">
        {gameState.isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading 3D Farm...</p>
          </div>
        )}
        <canvas ref={canvasRef} className="farm3d-canvas" />

        {/* Game UI Overlay */}
        <div className="farm3d-ui">
          {/* Tool Bar */}
          <div className="toolbar">
            {tools.map((tool) => (
              <button
                key={tool.id}
                className={`tool-btn ${
                  gameState.selectedTool === tool.id ? "active" : ""
                }`}
                onClick={() => handleToolSelect(tool.id)}
                style={{ borderColor: tool.color }}
                title={tool.name}
              >
                <span className="tool-icon">{tool.icon}</span>
                <span className="tool-name">{tool.name}</span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <Button variant="primary" size="small" onClick={handleStoreToggle}>
              🏪 Store
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setShowInventory(!showInventory)}
            >
              📦 Inventory
            </Button>
          </div>

          {/* Store Modal */}
          {showStore && (
            <div className="store-modal">
              <div className="store-header">
                <h3>🏪 Farm Store</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowStore(false)}
                >
                  ✕
                </button>
              </div>
              <div className="store-items">
                {storeItems.map((item) => (
                  <div key={item.id} className="store-item">
                    <span className="item-icon">{item.icon}</span>
                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-price">${item.price}</div>
                    </div>
                    <Button
                      size="small"
                      variant={
                        gameState.money >= item.price ? "primary" : "outline"
                      }
                      disabled={gameState.money < item.price}
                      onClick={() => handleItemPurchase(item)}
                    >
                      Buy
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="instructions">
            <p>
              🖱️ Drag to rotate • 🖲️ Scroll to zoom • Select tools to interact
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Farm3DCard;
