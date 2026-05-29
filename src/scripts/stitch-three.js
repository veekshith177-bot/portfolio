import * as THREE from 'three';

export function initHeroScene(container) {
  if (!container) return null;

  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(0, 2, 10);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.insertBefore(renderer.domElement, container.children[1]);

  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1c1b1b, roughness: 0.7, metalness: 0.8 });
  const purpleEmit = new THREE.MeshStandardMaterial({ color: 0xdcb8ff, emissive: 0xdcb8ff, emissiveIntensity: 0.8 });
  const cyanEmit = new THREE.MeshStandardMaterial({ color: 0x00daf3, emissive: 0x00daf3, emissiveIntensity: 0.8 });

  const rack = new THREE.Mesh(new THREE.BoxGeometry(3, 6, 2.5), darkMat);
  rack.position.set(-1.5, 0, 0);
  worldGroup.add(rack);

  for (let i = 0; i < 5; i++) {
    const server = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 2.6), darkMat);
    server.position.set(-1.5, -2 + i * 1.2, 0);
    worldGroup.add(server);

    const pLight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), i % 2 === 0 ? cyanEmit : purpleEmit);
    pLight.position.set(-0.5, -2 + i * 1.2, 1.35);
    worldGroup.add(pLight);

    const pLight2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), i % 2 !== 0 ? cyanEmit : purpleEmit);
    pLight2.position.set(-0.8, -2 + i * 1.2, 1.35);
    worldGroup.add(pLight2);
  }

  const charGroup = new THREE.Group();
  const head = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), purpleEmit);
  head.position.set(0, 1.5, 0);
  charGroup.add(head);

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.5, 0.5), cyanEmit);
  body.position.set(0, 0, 0);
  charGroup.add(body);

  charGroup.position.set(2, -1.5, 1);
  worldGroup.add(charGroup);

  const wireMatPurple = new THREE.LineBasicMaterial({ color: 0xdcb8ff });
  const wireMatCyan = new THREE.LineBasicMaterial({ color: 0x00daf3 });

  const points1 = [new THREE.Vector3(-1.5, 2, 0), new THREE.Vector3(0, 3, -1), new THREE.Vector3(2, 1.5, 0)];
  worldGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points1), wireMatPurple));

  const points2 = [new THREE.Vector3(-1.5, -1, 1), new THREE.Vector3(0, -2, 2), new THREE.Vector3(2, -1.5, 1)];
  worldGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points2), wireMatCyan));

  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  const pointLightP = new THREE.PointLight(0xdcb8ff, 2, 20);
  pointLightP.position.set(2, 4, 3);
  scene.add(pointLightP);

  const pointLightC = new THREE.PointLight(0x00daf3, 2, 20);
  pointLightC.position.set(-3, -2, 4);
  scene.add(pointLightC);

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  const windowHalfX = width / 2;
  const windowHalfY = height / 2;

  container.addEventListener('mousemove', (event) => {
    const rect = container.getBoundingClientRect();
    mouseX = (event.clientX - rect.left) - windowHalfX;
    mouseY = (event.clientY - rect.top) - windowHalfY;
  });

  container.addEventListener('mouseleave', () => {
    mouseX = 0; mouseY = 0;
  });

  const clock = new THREE.Clock();
  let animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    worldGroup.position.y = Math.sin(time) * 0.2;
    head.rotation.y = Math.sin(time * 2) * 0.2;

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    worldGroup.rotation.y += 0.05 * (targetX - worldGroup.rotation.y);
    worldGroup.rotation.x += 0.05 * (targetY - worldGroup.rotation.x);

    renderer.render(scene, camera);
  }

  animate();

  function handleResize() {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }

  window.addEventListener('resize', handleResize);

  return {
    destroy: () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    },
  };
}

export function initSkinGallery(container) {
  if (!container) return null;

  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const materials = [
    new THREE.MeshStandardMaterial({ color: 0x00daf3, wireframe: true }),
    new THREE.MeshStandardMaterial({ color: 0xdcb8ff, wireframe: true }),
    new THREE.MeshStandardMaterial({ color: 0x8a2be2 }),
    new THREE.MeshStandardMaterial({ color: 0x1c1b1b }),
    new THREE.MeshStandardMaterial({ color: 0x00daf3 }),
    new THREE.MeshStandardMaterial({ color: 0xdcb8ff }),
  ];

  const cube = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), materials);
  scene.add(cube);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(2, 2, 5);
  scene.add(directionalLight);

  let animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();

  return {
    destroy: () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
    },
  };
}
