<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';

  let canvas: HTMLCanvasElement;
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.OrthographicCamera;
  let mesh: THREE.Mesh;
  let material: THREE.RawShaderMaterial;
  let geometry: THREE.BufferGeometry;
  let animationId: number;
  let resizeListener: () => void;

  const renderParam = {
    clearColor: 0x0A0D10, // bg-brand-black
    width: 0,
    height: 0
  };

  const vertexShader = `
    attribute vec3 position;

    void main()	{
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform vec2 resolution;
    uniform float time;
    uniform float xScale;
    uniform float yScale;
    uniform float distortion;

    void main() {
      vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
      
      float d = length(p) * distortion;
      
      float rx = p.x * (1.0 + d);
      float gx = p.x;
      float bx = p.x * (1.0 - d);

      // Adjusted for Purple Theme (Brand Purple: #6C3BAA)
      // R: High, G: Low, B: High
      
      float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
      float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
      float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
      
      // Tint output towards purple
      vec3 color = vec3(r * 0.6, g * 0.2, b * 0.9);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  onMount(() => {
    if (typeof window === 'undefined') return;

    renderParam.width = window.innerWidth;
    renderParam.height = window.innerHeight;

    scene = new THREE.Scene();
    
    // Setting alpha: true allows the canvas to be transparent where nothing is drawn,
    // but here we overwrite mostly everything.
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(new THREE.Color(renderParam.clearColor));
    renderer.setSize(renderParam.width, renderParam.height);

    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const position = new Float32Array([
      -1.0, -1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0,  1.0, 0.0
    ]);

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));

    material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        resolution: { value: new THREE.Vector2(renderParam.width, renderParam.height) },
        time: { value: 0.0 },
        xScale: { value: 1.0 },
        yScale: { value: 0.5 },
        distortion: { value: 0.050 }
      },
      side: THREE.DoubleSide
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Resize Handler
    resizeListener = () => {
        renderParam.width = window.innerWidth;
        renderParam.height = window.innerHeight;
        renderer.setSize(renderParam.width, renderParam.height);
        material.uniforms.resolution.value.set(renderParam.width, renderParam.height);
    };

    window.addEventListener("resize", resizeListener);

    // Animation Loop
    const animate = () => {
        material.uniforms.time.value += 0.01;
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
    };
    animate();
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener("resize", resizeListener);
        cancelAnimationFrame(animationId);
        
        // Clean up Three.js resources
        if (geometry) geometry.dispose();
        if (material) material.dispose();
        if (renderer) renderer.dispose();
    }
  });
</script>

<canvas 
  bind:this={canvas} 
  class="absolute inset-0 w-full h-full -z-10"
></canvas>
