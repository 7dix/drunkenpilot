<template>
  <div id="app">
    <div v-if="gameState === 'setup'" class="container">
      <GameSetup @start-game="startGame" />
    </div>
    
    <div v-else-if="gameState === 'playing'" class="game-container">
      <GameController 
        :players="players"
        :cards="shuffledCards"
        @game-finished="showStats"
        @save-game="saveGameState"
      />
    </div>
    
    <div v-else-if="gameState === 'stats'" class="container">
      <StatsComponent 
        :players="players"
        :gameStats="gameStats"
        @new-game="resetGame"
        @continue-game="continueGame"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import GameSetup from './components/GameSetup.vue'
import GameController from './components/GameController.vue'
import StatsComponent from './components/StatsComponent.vue'
import cardsData from './data/cards.json'

export default {
  name: 'App',
  components: {
    GameSetup,
    GameController,
    StatsComponent
  },
  setup() {
    const gameState = ref('setup') // 'setup', 'playing', 'stats'
    const players = ref([])
    const shuffledCards = ref([])
    const gameStats = ref({})

    // Load saved game state on startup
    onMounted(() => {
      loadGameState()
    })

    const startGame = (playerList) => {
      players.value = playerList.map(name => ({
        name,
        drinks: 0,
        completedTasks: 0,
        failedTasks: 0
      }))
      
      // Shuffle cards
      shuffledCards.value = shuffleArray([...cardsData.cards])
      
      gameState.value = 'playing'
      saveGameState()
    }

    const showStats = (stats) => {
      gameStats.value = stats
      gameState.value = 'stats'
      saveGameState()
    }

    const resetGame = () => {
      gameState.value = 'setup'
      players.value = []
      shuffledCards.value = []
      gameStats.value = {}
      clearGameState()
    }

    const continueGame = () => {
      gameState.value = 'playing'
    }

    const shuffleArray = (array) => {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    const saveGameState = () => {
      const state = {
        gameState: gameState.value,
        players: players.value,
        shuffledCards: shuffledCards.value,
        gameStats: gameStats.value,
        timestamp: Date.now()
      }
      localStorage.setItem('drunkenpilot-game', JSON.stringify(state))
    }

    const loadGameState = () => {
      try {
        const saved = localStorage.getItem('drunkenpilot-game')
        if (saved) {
          const state = JSON.parse(saved)
          // Only load if saved within last 24 hours
          if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
            gameState.value = state.gameState || 'setup'
            players.value = state.players || []
            shuffledCards.value = state.shuffledCards || []
            gameStats.value = state.gameStats || {}
          }
        }
      } catch (error) {
        console.error('Error loading game state:', error)
        clearGameState()
      }
    }

    const clearGameState = () => {
      localStorage.removeItem('drunkenpilot-game')
    }

    return {
      gameState,
      players,
      shuffledCards,
      gameStats,
      startGame,
      showStats,
      resetGame,
      continueGame,
      saveGameState
    }
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
}
</style>