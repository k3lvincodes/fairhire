<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';

  let containerEl: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let particles: THREE.Points;
  let particleMaterial: THREE.ShaderMaterial;
  let animationId: number;
  let resizeObserver: ResizeObserver;

  const config = {
    winWidth: 0,
    winHeight: 0,
    aspectRatio: 1,
    mouse: new THREE.Vector2(-10, -10)
  };

  const particleVertex = `
    attribute float scale;
    uniform float uTime;

    void main() {
        vec3 p = position;
        float s = scale;

        p.y += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;
        p.x += (sin(p.y + uTime) * 0.5);
        s += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;

        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = s * 15.0 * (1.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Modified to use Brand Purple
  const particleFragment = `
    void main() {
        // Brand Purple #6C3BAA approx (0.42, 0.23, 0.67) + alpha
        gl_FragColor = vec4(0.5, 0.3, 0.8, 0.5);
    }
  `;

  function getContainerSize() {
    // Use parent element's size (the wrapper div in +page.svelte)
    const parent = containerEl?.parentElement;
    if (parent) {
      return {
        width: parent.clientWidth,
        height: parent.clientHeight
      };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  function init() {
    const size = getContainerSize();
    config.winWidth = size.width;
    config.winHeight = size.height;
    config.aspectRatio = config.winWidth / config.winHeight;

    scene = new THREE.Scene();
    
    // Camera — position further back to cover taller canvas
    camera = new THREE.PerspectiveCamera(75, config.aspectRatio, 0.01, 1000);
    camera.position.set(0, 6, 5);
    camera.lookAt(scene.position);

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(config.winWidth, config.winHeight);
    
    // Particles
    initParticles();
  }

  function initParticles() {
    const gap = 0.3;
    const amountX = 150;
    const amountY = 150;
    const particleNum = amountX * amountY;
    const particlePositions = new Float32Array(particleNum * 3);
    const particleScales = new Float32Array(particleNum);
    let i = 0;
    let j = 0;

    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        particlePositions[i] = ix * gap - ((amountX * gap) / 2);
        particlePositions[i + 1] = 0;
        particlePositions[i + 2] = iy * gap - ((amountX * gap) / 2);
        particleScales[j] = 1;
        i += 3;
        j++;
      }
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    particleMaterial = new THREE.ShaderMaterial({
        transparent: true,
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        uniforms: {
            uTime: { value: 0 }
        }
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
  }

  function animate() {
    if (particleMaterial) {
        particleMaterial.uniforms.uTime.value += 0.02;
    }

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  }

  function handleResize() {
    const size = getContainerSize();
    config.winWidth = size.width;
    config.winHeight = size.height;
    camera.aspect = config.winWidth / config.winHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(config.winWidth, config.winHeight);
  }

  onMount(() => {
    if (typeof window === 'undefined') return;
    init();
    animate();

    // Use ResizeObserver on the parent container to track its full height
    const parent = containerEl?.parentElement;
    if (parent) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(parent);
    }

    // Also listen to window resize for width changes
    window.addEventListener('resize', handleResize);
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
        if (resizeObserver) resizeObserver.disconnect();
        cancelAnimationFrame(animationId);
        if (renderer) renderer.dispose();
        if (particleMaterial) particleMaterial.dispose();
    }
  });
</script>

<div bind:this={containerEl} class="absolute inset-0 w-full h-full">
  <canvas 
    bind:this={canvas} 
    class="absolute inset-0 w-full h-full -z-10 bg-brand-black pointer-events-none"
    style="opacity: 0.8;" 
  ></canvas>
</div>
