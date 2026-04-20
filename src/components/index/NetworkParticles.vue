<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const canvas = ref(null)
const particles = ref([])
let animationId = null
let ctx = null
let isDarkMode = false
let mouseX = null
let mouseY = null
let hasJumped = false
const JUMP_THRESHOLD = 300

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.radius = Math.random() * 2 + 1
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
  const particleCount = 80
  particles.value = []
  for (let i = 0; i < particleCount; i++) {
    particles.value.push(new Particle(width, height))
  }
}

const getColors = () => {
  if (isDarkMode) {
    return {
      particle: 'rgba(135, 206, 250, 0.8)',
      link: 'rgba(255, 255, 255, '
    }
  } else {
    return {
      particle: 'rgba(255, 107, 107, 0.8)',
      link: 'rgba(255, 255, 255, '
    }
  }
}

const connectParticles = (canvasWidth, canvasHeight, linkColor) => {
  const linkDistance = 150
  const maxMouseConnections = 5
  let connectionCount = 0
  
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
        connectionCount++
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
      connectionCount++
    }
  }
  
  // 检查连线数量，达到阈值时显示通知询问是否跳转
  if (connectionCount >= JUMP_THRESHOLD && !hasJumped) {
    hasJumped = true
    if (typeof window !== 'undefined' && window.toast) {
      // 调用自定义通知函数，显示带有按钮的通知
      showJumpNotification()
    }
  }
}

const showJumpNotification = () => {
  // 直接添加通知
  if (typeof window !== 'undefined' && window.toast) {
    // 由于toast API不支持直接传递按钮，我们需要修改Notification组件的全局方法
    // 这里直接修改window.toast对象，添加一个带按钮的通知方法
    if (!window.toast.withButtons) {
      window.toast.withButtons = (message, type = 'info', duration = 5000, buttons = []) => {
        // 直接操作notifications数组
        if (window.notificationComponent) {
          window.notificationComponent.addNotification(message, type, duration, buttons)
        } else {
          // 如果没有notificationComponent，使用默认通知
          window.toast[type](message, duration)
        }
      }
    }
    
    // 显示带按钮的通知
    window.toast.withButtons(
      '检测到粒子连线达到阈值，是否跳转到终端页面？',
      'info',
      10000,
      [
        {
          text: '确定',
          action: () => {
            router.push('/terminal')
          }
        },
        {
          text: '取消',
          action: () => {
            // 取消操作，不做任何事
          }
        }
      ]
    )
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

const handleMouseLeave = () => {
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
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    
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
