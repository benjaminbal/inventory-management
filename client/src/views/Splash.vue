<template>
  <div class="splash-page">
    <!-- Background grid -->
    <div class="bg-grid"></div>

    <!-- Floating particles -->
    <div class="particles">
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :style="{
          left: particle.left + '%',
          top: particle.top + '%',
          width: particle.size + 'px',
          height: particle.size + 'px',
          animationDelay: particle.delay + 's',
          animationDuration: particle.duration + 's',
          opacity: particle.opacity
        }"
      ></div>
    </div>

    <!-- Main content -->
    <div class="splash-content">
      <!-- 3D Wireframe sphere -->
      <div class="sphere-container">
        <div class="sphere-wrapper">
          <!-- Equator and latitude rings -->
          <div class="sphere-ring ring-equator"></div>
          <div class="sphere-ring ring-lat-30n"></div>
          <div class="sphere-ring ring-lat-60n"></div>
          <div class="sphere-ring ring-lat-30s"></div>
          <div class="sphere-ring ring-lat-60s"></div>
          <!-- Longitude rings (meridians) -->
          <div class="sphere-ring ring-meridian-0"></div>
          <div class="sphere-ring ring-meridian-30"></div>
          <div class="sphere-ring ring-meridian-60"></div>
          <div class="sphere-ring ring-meridian-90"></div>
          <div class="sphere-ring ring-meridian-120"></div>
          <div class="sphere-ring ring-meridian-150"></div>
          <!-- Outer orbit rings -->
          <div class="orbit-ring orbit-1"></div>
          <div class="orbit-ring orbit-2"></div>
          <!-- Core glow -->
          <div class="sphere-core"></div>
        </div>
      </div>

      <!-- Title -->
      <h1 class="splash-title">CATALYST COMPONENTS</h1>
      <p class="splash-subtitle">INVENTORY INTELLIGENCE PLATFORM</p>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-item" v-for="stat in stats" :key="stat.label">
          <span class="stat-value-gradient">{{ stat.value }}</span>
          <span class="stat-label-text">{{ stat.label }}</span>
        </div>
      </div>

      <!-- CTA button -->
      <button class="cta-button" @click="enterPlatform">
        ENTER PLATFORM &rarr;
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Splash',
  setup() {
    const router = useRouter()

    const enterPlatform = () => {
      router.push('/dashboard')
    }

    // Generate 25 particles with random positions, sizes, and animation timings
    const particles = ref(
      Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 8,
        duration: 4 + Math.random() * 6,
        opacity: 0.3 + Math.random() * 0.4
      }))
    )

    const stats = ref([
      { value: '7+', label: 'Views' },
      { value: '3', label: 'Warehouses' },
      { value: '500+', label: 'Orders' }
    ])

    return {
      enterPlatform,
      particles,
      stats
    }
  }
}
</script>

<style scoped>
/* ── Base page ── */
.splash-page {
  position: fixed;
  inset: 0;
  min-height: 100vh;
  width: 100vw;
  background: radial-gradient(ellipse at 50% 40%, #0d0d2b 0%, #050510 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 9999;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ── Background grid ── */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

/* ── Floating particles ── */
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: #a5d8ff;
  border-radius: 50%;
  animation: floatParticle linear infinite;
}

@keyframes floatParticle {
  0% { transform: translateY(0px) translateX(0px); opacity: inherit; }
  25% { transform: translateY(-15px) translateX(8px); }
  50% { transform: translateY(-25px) translateX(-5px); opacity: 0.1; }
  75% { transform: translateY(-10px) translateX(12px); }
  100% { transform: translateY(0px) translateX(0px); opacity: inherit; }
}

/* ── Main content ── */
.splash-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  text-align: center;
}

/* ── 3D Wireframe Sphere ── */
.sphere-container {
  width: 400px;
  height: 400px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.sphere-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
  transform-style: preserve-3d;
  animation: rotateSphere 25s linear infinite;
}

@keyframes rotateSphere {
  from { transform: rotateY(0deg) rotateX(15deg); }
  to   { transform: rotateY(360deg) rotateX(15deg); }
}

/* Shared ring styles */
.sphere-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(100, 180, 255, 0.25);
  border-radius: 50%;
  transform-origin: center center;
}

/* ── Latitude rings ── */
/* Equator: full circle, centered */
.ring-equator {
  width: 300px;
  height: 300px;
  margin-left: -150px;
  margin-top: -150px;
  transform: rotateX(90deg);
}

/* +30° latitude: smaller circle */
.ring-lat-30n {
  width: 260px;
  height: 260px;
  margin-left: -130px;
  margin-top: -130px;
  transform: rotateX(90deg) translateY(-50px);
  border-color: rgba(100, 180, 255, 0.18);
}

.ring-lat-60n {
  width: 150px;
  height: 150px;
  margin-left: -75px;
  margin-top: -75px;
  transform: rotateX(90deg) translateY(-110px);
  border-color: rgba(100, 180, 255, 0.12);
}

.ring-lat-30s {
  width: 260px;
  height: 260px;
  margin-left: -130px;
  margin-top: -130px;
  transform: rotateX(90deg) translateY(50px);
  border-color: rgba(100, 180, 255, 0.18);
}

.ring-lat-60s {
  width: 150px;
  height: 150px;
  margin-left: -75px;
  margin-top: -75px;
  transform: rotateX(90deg) translateY(110px);
  border-color: rgba(100, 180, 255, 0.12);
}

/* ── Longitude rings (meridians) ── */
.ring-meridian-0 {
  width: 300px;
  height: 300px;
  margin-left: -150px;
  margin-top: -150px;
  transform: rotateY(0deg);
}

.ring-meridian-30 {
  width: 300px;
  height: 300px;
  margin-left: -150px;
  margin-top: -150px;
  transform: rotateY(30deg);
}

.ring-meridian-60 {
  width: 300px;
  height: 300px;
  margin-left: -150px;
  margin-top: -150px;
  transform: rotateY(60deg);
}

.ring-meridian-90 {
  width: 300px;
  height: 300px;
  margin-left: -150px;
  margin-top: -150px;
  transform: rotateY(90deg);
}

.ring-meridian-120 {
  width: 300px;
  height: 300px;
  margin-left: -150px;
  margin-top: -150px;
  transform: rotateY(120deg);
}

.ring-meridian-150 {
  width: 300px;
  height: 300px;
  margin-left: -150px;
  margin-top: -150px;
  transform: rotateY(150deg);
}

/* ── Outer orbit rings ── */
.orbit-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(168, 85, 247, 0.2);
  top: 50%;
  left: 50%;
  transform-origin: center center;
}

.orbit-1 {
  width: 360px;
  height: 360px;
  margin-left: -180px;
  margin-top: -180px;
  transform: rotateX(70deg) rotateZ(20deg);
  border-color: rgba(168, 85, 247, 0.25);
  animation: orbitPulse1 8s ease-in-out infinite;
}

.orbit-2 {
  width: 400px;
  height: 400px;
  margin-left: -200px;
  margin-top: -200px;
  transform: rotateX(75deg) rotateZ(-15deg);
  border-color: rgba(6, 182, 212, 0.2);
  animation: orbitPulse2 12s ease-in-out infinite;
}

@keyframes orbitPulse1 {
  0%, 100% { border-color: rgba(168, 85, 247, 0.25); }
  50% { border-color: rgba(168, 85, 247, 0.5); }
}

@keyframes orbitPulse2 {
  0%, 100% { border-color: rgba(6, 182, 212, 0.2); }
  50% { border-color: rgba(6, 182, 212, 0.45); }
}

/* ── Core glow ── */
.sphere-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  margin-left: -40px;
  margin-top: -40px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 70%);
  filter: blur(8px);
  animation: coreGlow 4s ease-in-out infinite alternate;
}

@keyframes coreGlow {
  from { opacity: 0.5; transform: scale(1); }
  to   { opacity: 1; transform: scale(1.3); }
}

/* ── Title ── */
.splash-title {
  font-size: clamp(2rem, 5vw, 5rem);
  font-weight: 900;
  letter-spacing: 0.08em;
  line-height: 1;
  background: linear-gradient(135deg, #a855f7 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
}

/* ── Subtitle ── */
.splash-subtitle {
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  color: #64748b;
  margin: 0;
  text-transform: uppercase;
}

/* ── Stats row ── */
.stats-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  min-width: 100px;
  backdrop-filter: blur(8px);
}

.stat-value-gradient {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #a855f7 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1;
}

.stat-label-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ── CTA button ── */
.cta-button {
  position: relative;
  padding: 0.875rem 2.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #fff;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  /* Gradient border trick using pseudo-element + background-clip */
  background: linear-gradient(#050510, #050510) padding-box,
              linear-gradient(135deg, #a855f7, #06b6d4) border-box;
  border: 1.5px solid transparent;
}

.cta-button:hover {
  background: linear-gradient(rgba(168, 85, 247, 0.15), rgba(6, 182, 212, 0.15)) padding-box,
              linear-gradient(135deg, #a855f7, #06b6d4) border-box;
  box-shadow:
    0 0 20px rgba(168, 85, 247, 0.35),
    0 0 40px rgba(6, 182, 212, 0.2);
  transform: translateY(-1px);
}

.cta-button:active {
  transform: translateY(0);
}
</style>
