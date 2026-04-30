<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
const particles = ref([])
let animationId = null
let ctx = null
let isDarkMode = false
let mouseX = null
let mouseY = null

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.vx = (Math.random() - 0.5) * 1.5 // 加快速度
    this.vy = (Math.random() - 0.5) * 1.5
    this.radius = Math.random() * 3 + 1.5 // 增大粒子
    this.originalVx = this.vx
    this.originalVy = this.vy
  }

  draw(ctx, color) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }

  update(canvasWidth, canvasHeight) {
    if (mouseX !== null && mouseY !== null) {
      const dx = mouseX - this.x
      const dy = mouseY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 200) {
        const attractionStrength = 0.02 * (1 - distance / 200)
        this.vx += dx * attractionStrength
        this.vy += dy * attractionStrength
        
        this.vx = Math.max(-2, Math.min(2, this.vx))
        this.vy = Math.max(-2, Math.min(2, this.vy))
      } else {
        this.vx += (this.originalVx - this.vx) * 0.05
        this.vy += (this.originalVy - this.vy) * 0.05
      }
    }
    
    this.x += this.vx
    this.y += this.vy

    if (this.x < 0 || this.x > canvasWidth) this.vx *= -1
    if (this.y < 0 || this.y > canvasHeight) this.vy *= -1
  }
}

const checkTheme = () => {
  isDarkMode = document.body.classList.contains('dark-theme')
}

const initParticles = (width, height) => {
  // 根据屏幕尺寸动态调整粒子数量
  const screenArea = width * height
  const baseParticleCount = 80 // 增加粒子数量
  const densityFactor = screenArea / (1920 * 1080) // 基于1080p的密度
  const particleCount = Math.floor(baseParticleCount * Math.min(densityFactor, 2.5))
  
  particles.value = []
  for (let i = 0; i < particleCount; i++) {
    particles.value.push(new Particle(width, height))
  }
}

const getColors = () => {
  if (isDarkMode) {
    return {
      particle: 'rgba(78, 205, 196, 0.9)', // 青色
      link: 'rgba(78, 205, 196, '
    }
  } else {
    return {
      particle: 'rgba(255, 142, 83, 0.9)', // 橙色
      link: 'rgba(255, 142, 83, '
    }
  }
}

const connectParticles = (canvasWidth, canvasHeight, linkColor) => {
  const linkDistance = 180
  const maxMouseConnections = 8
  
  for (let i = 0; i < particles.value.length; i++) {
    for (let j = i + 1; j < particles.value.length; j++) {
      const dx = particles.value[i].x - particles.value[j].x
      const dy = particles.value[i].y - particles.value[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < linkDistance) {
        ctx.beginPath()
        ctx.strokeStyle = `${linkColor}${1 - distance / linkDistance})`
        ctx.lineWidth = 1
        ctx.moveTo(particles.value[i].x, particles.value[i].y)
        ctx.lineTo(particles.value[j].x, particles.value[j].y)
        ctx.stroke()
      }
    }
  }
  
  if (mouseX !== null && mouseY !== null) {
    const mouseConnections = []
    for (let i = 0; i < particles.value.length; i++) {
      const dx = particles.value[i].x - mouseX
      const dy = particles.value[i].y - mouseY
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < linkDistance) {
        mouseConnections.push({ index: i, distance })
      }
    }
    
    mouseConnections.sort((a, b) => a.distance - b.distance)
    const connectionsToDraw = mouseConnections.slice(0, maxMouseConnections)
    
    for (const conn of connectionsToDraw) {
      ctx.beginPath()
      ctx.strokeStyle = `${linkColor}${1 - conn.distance / linkDistance})`
      ctx.lineWidth = 1.5
      ctx.moveTo(particles.value[conn.index].x, particles.value[conn.index].y)
      ctx.lineTo(mouseX, mouseY)
      ctx.stroke()
    }
  }
}

const animate = (width, height) => {
  checkTheme()
  const colors = getColors()
  
  ctx.clearRect(0, 0, width, height)

  particles.value.forEach(particle => {
    particle.update(width, height)
    particle.draw(ctx, colors.particle)
  })

  connectParticles(width, height, colors.link)
  animationId = requestAnimationFrame(() => animate(width, height))
}

const resizeCanvas = () => {
  if (!canvas.value) return
  const width = window.innerWidth
  const height = window.innerHeight
  canvas.value.width = width
  canvas.value.height = height
  initParticles(width, height)
}

const handleMouseMove = (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
}

const handleTouchMove = (e) => {
  if (e.touches.length > 0) {
    mouseX = e.touches[0].clientX
    mouseY = e.touches[0].clientY
    e.preventDefault() // 防止滚动
  }
}

const handleMouseLeave = () => {
  mouseX = null
  mouseY = null
}

const handleTouchEnd = () => {
  mouseX = null
  mouseY = null
}

let observer = null

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d')
    checkTheme()
    resizeCanvas()
    animate(canvas.value.width, canvas.value.height)
    
    // 添加事件监听器
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
    
    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            checkTheme()
          }
        })
      })
      
      observer.observe(document.body, {
        attributes: true
      })
    }
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseleave', handleMouseLeave)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <canvas
    ref="canvas"
    class="network-particles"
  ></canvas>
</template>

<!-- 布局样式 -->
<style scoped>
.network-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}
</style>

<!-- 颜色样式 -->
<style scoped>
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>
