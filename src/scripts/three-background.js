import * as THREE from 'three';

export function initThreeScene(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const torusGeometry = new THREE.TorusKnotGeometry(1.8, 0.5, 100, 16);
  const torusMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff41,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  scene.add(torus);

  const particlesCount = 200;
  const positions = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 30;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  const ringCount = 3;
  const rings = [];
  for (let i = 0; i < ringCount; i++) {
    const ringGeo = new THREE.RingGeometry(2 + i * 0.8, 2.1 + i * 0.8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x00ff41 : 0x00d4ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.04,
      wireframe: true,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    ring.rotation.y = Math.PI / 4 + i * 0.5;
    scene.add(ring);
    rings.push(ring);
  }

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  camera.position.z = 6;

  let animationId;

  function animate() {
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    torus.rotation.x += 0.003;
    torus.rotation.y += 0.005;
    torus.position.x = mouseX * 0.5;
    torus.position.y = -mouseY * 0.5;

    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;

    rings.forEach((ring, i) => {
      ring.rotation.z += 0.002 * (i + 1);
      ring.position.x = mouseX * 0.3 * (1 - i * 0.2);
      ring.position.y = -mouseY * 0.3 * (1 - i * 0.2);
    });

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  }

  animate();

  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 150);
  }
  window.addEventListener('resize', handleResize);

  return {
    destroy: () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      torusGeometry.dispose();
      torusMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      rings.forEach(r => {
        r.geometry.dispose();
        r.material.dispose();
      });
    },
  };
}
