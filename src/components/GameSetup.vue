<template>
  <div class="setup-container">
    <h1 class="title">🏴‍☠️ DrunkenPilot</h1>
    <p class="subtitle">The Ultimate Pirate Drinking Game</p>
    
    <div class="card">
      <h2 class="pirate-font" style="font-size: 1.5rem; margin-bottom: 1rem; color: #1e3a8a;">
        Set Sail with Your Crew!
      </h2>
      
      <div class="player-input-section">
        <div class="input-group">
          <input 
            v-model="newPlayerName"
            @keyup.enter="addPlayer"
            type="text" 
            placeholder="Enter player name" 
            class="input"
            maxlength="20"
          />
          <button 
            @click="addPlayer"
            :disabled="!newPlayerName.trim() || players.length >= 20"
            class="btn"
            style="margin-top: 0.5rem;"
          >
            Add Pirate
          </button>
        </div>
        
        <div v-if="players.length > 0" class="players-preview">
          <h3 style="margin: 1rem 0 0.5rem 0; color: #374151;">
            Your Crew ({{ players.length }}/20):
          </h3>
          <div class="player-list">
            <div 
              v-for="(player, index) in players" 
              :key="index"
              class="player-item"
              style="background: #e5e7eb; color: #374151; position: relative;"
            >
              {{ player }}
              <button 
                @click="removePlayer(index)"
                style="
                  position: absolute; 
                  right: -8px; 
                  top: -8px; 
                  width: 20px; 
                  height: 20px; 
                  border-radius: 50%; 
                  background: #ef4444; 
                  color: white; 
                  border: none; 
                  font-size: 12px; 
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
                title="Remove player"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="game-info" style="margin: 2rem 0; padding: 1rem; background: #f3f4f6; border-radius: 12px; color: #374151;">
        <h3 style="margin-bottom: 0.5rem;">How to Play:</h3>
        <ul style="text-align: left; padding-left: 1.5rem;">
          <li><strong>Beach Quests:</strong> Complete physical tasks within the time limit</li>
          <li><strong>Knowledge Challenges:</strong> Answer questions correctly</li>
          <li><strong>Movement Tasks:</strong> Perform the required physical activity</li>
          <li><strong>Fail a task?</strong> Take a sip from the shared cup! 🍻</li>
        </ul>
      </div>
      
      <div class="action-buttons">
        <button 
          @click="startGame"
          :disabled="players.length < 2"
          class="btn"
          style="width: 100%; font-size: 1.2rem; padding: 1.2rem;"
        >
          {{ players.length < 2 ? 'Need at least 2 pirates!' : `Start Adventure with ${players.length} Pirates` }}
        </button>
        
        <button 
          v-if="players.length > 0"
          @click="clearPlayers"
          class="btn btn-secondary"
          style="width: 100%; margin-top: 1rem;"
        >
          Clear All Pirates
        </button>
      </div>
    </div>
    
    <!-- Quick setup buttons -->
    <div class="quick-setup" style="margin-top: 1rem;">
      <p style="text-align: center; margin-bottom: 0.5rem; opacity: 0.8;">Quick Setup:</p>
      <div style="display: flex; gap: 0.5rem; justify-content: center;">
        <button @click="quickSetup(2)" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
          2 Players
        </button>
        <button @click="quickSetup(4)" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
          4 Players
        </button>
        <button @click="quickSetup(6)" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
          6 Players
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'GameSetup',
  emits: ['start-game'],
  setup(props, { emit }) {
    const newPlayerName = ref('')
    const players = ref([])

    const addPlayer = () => {
      const name = newPlayerName.value.trim()
      if (name && !players.value.includes(name) && players.value.length < 20) {
        players.value.push(name)
        newPlayerName.value = ''
      }
    }

    const removePlayer = (index) => {
      players.value.splice(index, 1)
    }

    const clearPlayers = () => {
      players.value = []
    }

    const startGame = () => {
      if (players.value.length >= 2) {
        emit('start-game', players.value)
      }
    }

    const quickSetup = (count) => {
      players.value = []
      for (let i = 1; i <= count; i++) {
        players.value.push(`Pirate ${i}`)
      }
    }

    return {
      newPlayerName,
      players,
      addPlayer,
      removePlayer,
      clearPlayers,
      startGame,
      quickSetup
    }
  }
}
</script>

<style scoped>
.setup-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.input-group {
  margin-bottom: 1rem;
}

.players-preview {
  margin-top: 1rem;
}

.action-buttons {
  margin-top: 2rem;
}

@media (max-width: 480px) {
  .setup-container {
    padding: 1rem 0.5rem;
  }
}
</style>