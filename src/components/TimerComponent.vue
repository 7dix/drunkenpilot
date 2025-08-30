<template>
  <div class="timer-container">
    <div class="timer" :class="{ warning: timeLeft <= 10, danger: timeLeft <= 5 }">
      <div class="timer-display">
        <span class="timer-text">{{ formatTime(timeLeft) }}</span>
      </div>
      <div class="timer-bar">
        <div 
          class="timer-fill" 
          :style="{ width: `${(timeLeft / duration) * 100}%` }"
          :class="{ warning: timeLeft <= 10, danger: timeLeft <= 5 }"
        ></div>
      </div>
    </div>
    
    <div class="timer-controls">
      <button @click="toggleTimer" class="btn btn-secondary timer-btn">
        {{ isRunning ? '⏸️ Pause' : '▶️ Start' }}
      </button>
      <button @click="stopTimer" class="btn btn-danger timer-btn">
        ⏹️ Stop
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'

export default {
  name: 'TimerComponent',
  props: {
    duration: {
      type: Number,
      default: 60
    },
    autoStart: {
      type: Boolean,
      default: true
    }
  },
  emits: ['timer-finished', 'timer-stopped', 'timer-paused'],
  setup(props, { emit }) {
    const timeLeft = ref(props.duration)
    const isRunning = ref(false)
    const intervalId = ref(null)

    onMounted(() => {
      if (props.autoStart) {
        startTimer()
      }
    })

    onUnmounted(() => {
      clearInterval(intervalId.value)
    })

    // Reset timer when duration changes
    watch(() => props.duration, (newDuration) => {
      timeLeft.value = newDuration
      if (isRunning.value) {
        stopTimer()
        startTimer()
      }
    })

    const startTimer = () => {
      if (timeLeft.value <= 0) {
        timeLeft.value = props.duration
      }
      
      isRunning.value = true
      intervalId.value = setInterval(() => {
        timeLeft.value--
        
        if (timeLeft.value <= 0) {
          finishTimer()
        }
      }, 1000)
    }

    const pauseTimer = () => {
      isRunning.value = false
      clearInterval(intervalId.value)
      emit('timer-paused')
    }

    const stopTimer = () => {
      isRunning.value = false
      clearInterval(intervalId.value)
      timeLeft.value = props.duration
      emit('timer-stopped')
    }

    const finishTimer = () => {
      isRunning.value = false
      clearInterval(intervalId.value)
      timeLeft.value = 0
      emit('timer-finished')
    }

    const toggleTimer = () => {
      if (isRunning.value) {
        pauseTimer()
      } else {
        startTimer()
      }
    }

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      
      if (minutes > 0) {
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
      } else {
        return `${remainingSeconds}s`
      }
    }

    return {
      timeLeft,
      isRunning,
      toggleTimer,
      stopTimer,
      formatTime
    }
  }
}
</script>

<style scoped>
.timer-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  margin: 1rem 0;
  backdrop-filter: blur(10px);
}

.timer {
  margin-bottom: 1rem;
}

.timer-display {
  margin-bottom: 0.5rem;
}

.timer-text {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fbbf24;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Pirata One', cursive;
}

.timer.warning .timer-text {
  color: #f59e0b;
  animation: pulse 1s infinite;
}

.timer.danger .timer-text {
  color: #ef4444;
  animation: pulse 0.5s infinite;
}

.timer-bar {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.timer-fill {
  height: 100%;
  background: #10b981;
  transition: width 1s linear;
  border-radius: 6px;
}

.timer-fill.warning {
  background: #f59e0b;
}

.timer-fill.danger {
  background: #ef4444;
}

.timer-controls {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.timer-btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  min-width: 100px;
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.7; 
    transform: scale(1.05);
  }
}

@media (max-width: 480px) {
  .timer-container {
    padding: 1rem;
  }
  
  .timer-text {
    font-size: 2rem;
  }
  
  .timer-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .timer-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>