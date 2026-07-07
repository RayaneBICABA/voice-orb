import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-voice-orb',
  imports: [],
  templateUrl: './voice-orb.html',
  styleUrl: './voice-orb.css',
})
export class VoiceOrb implements AfterViewInit, OnDestroy {
  @ViewChild('canvasEl') canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId!: number;
  private particles!: THREE.Points;
  private analyser!: AnalyserNode;
  private audioDataArray!: Uint8Array<ArrayBuffer>;

  async ngAfterViewInit() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement });
    this.renderer.setSize(500, 500);

    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    await this.initMicrophone();
    this.animate();
  }

  private animate = () => {
  this.animationFrameId = requestAnimationFrame(this.animate);

  this.analyser.getByteFrequencyData(this.audioDataArray);
  const volume = this.audioDataArray.reduce((a, b) => a + b) / this.audioDataArray.length;

  const scale = 1 + (volume / 255) * 0.6;
  this.particles.scale.set(scale, scale, scale);

  this.particles.rotation.y += 0.002;
  this.renderer.render(this.scene, this.camera);
};

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
  }

  private async initMicrophone() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  this.analyser = audioContext.createAnalyser();
  this.analyser.fftSize = 64;

  const source = audioContext.createMediaStreamSource(stream);
  source.connect(this.analyser);

  this.audioDataArray = new Uint8Array(this.analyser.frequencyBinCount);
}
}
