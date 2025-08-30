<template>
  <div class="game-container">
    <!-- Game Header -->
    <div class="game-header">
      <h1 class="title" style="font-size: 2rem; margin: 0.5rem 0;">🏴‍☠️ DrunkenPilot</h1>
      
      <!-- Player List -->
      <PlayerList 
        :players="players"
        :currentPlayerIndex="currentPlayerIndex"
      />
      
      <!-- Game Progress -->
      <div class="game-progress">
        <p>Card {{ currentCardIndex + 1 }} of {{ cards.length }}</p>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Card Display Area -->
    <div class="card-area">
      <CardDisplay 
        v-if="currentCard"
        :card="currentCard"
        :isFlipped="cardFlipped"
        :isQuest="currentCard.type === 'quest'"
        @flip-card="flipCard"
        @answer-selected="handleAnswer"
      />
      
      <!-- Timer Component for Quests -->
      <TimerComponent
        v-if="currentCard && currentCard.type === 'quest' && cardFlipped && !taskCompleted"
        :duration="currentCard.metadata?.timer || 60"
        @timer-finished="handleTimerFinished"
        @timer-stopped="timerStopped = true"
      />
    </div>

    <!-- Action Buttons -->
    <div class="action-area">
      <div v-if="!cardFlipped" class="draw-card-section">
        <h2 class="pirate-font" style="color: #fbbf24; margin-bottom: 1rem;">
          {{ currentPlayer.name }}'s Turn
        </h2>
        <button @click="flipCard" class="btn" style="width: 100%; font-size: 1.2rem;">
          Draw Card
        </button>
      </div>
      
      <div v-else-if="!taskCompleted" class="task-actions">
        <div v-if="currentCard.type === 'quest'" class="quest-actions">
          <button @click="completeTask(true)" class="btn" style="margin: 0.5rem; flex: 1;">
            ✅ Completed!
          </button>
          <button @click="completeTask(false)" class="btn btn-danger" style="margin: 0.5rem; flex: 1;">
            ❌ Failed
          </button>
        </div>
        
        <div v-else-if="currentCard.type === 'movement'" class="movement-actions">
          <button @click="completeTask(true)" class="btn" style="margin: 0.5rem; flex: 1;">
            ✅ Did it!
          </button>
          <button @click="completeTask(false)" class="btn btn-danger" style="margin: 0.5rem; flex: 1;">
            ❌ Couldn't do it
          </button>
        </div>
        
        <div v-else-if="currentCard.type === 'challenge' && !currentCard.options" class="open-challenge-actions">
          <p style="text-align: center; margin-bottom: 1rem; color: #fbbf24;">
            Ask this question to the group!
          </p>
          <button @click="completeTask(true)" class="btn" style="margin: 0.5rem; flex: 1;">
            ✅ Answered Correctly
          </button>
          <button @click="completeTask(false)" class="btn btn-danger" style="margin: 0.5rem; flex: 1;">
            ❌ Wrong Answer
          </button>
        </div>
      </div>
      
      <div v-else class="next-turn-section">
        <div class="task-result">
          <p v-if="lastTaskSuccess" class="success-message">
            🎉 Well done, {{ currentPlayer.name }}!
          </p>
          <p v-else class="failure-message">
            🍻 {{ currentPlayer.name }} takes a sip!
          </p>
        </div>
        
        <button @click="nextTurn" class="btn" style="width: 100%; margin-top: 1rem;">
          Next Turn
        </button>
      </div>
    </div>

    <!-- Game Menu -->
    <div class="game-menu">
      <button @click="showMenu = !showMenu" class="btn btn-secondary" style="padding: 0.5rem 1rem;">
        ⚙️ Menu
      </button>
      
      <div v-if="showMenu" class="menu-dropdown">
        <button @click="pauseGame" class="btn btn-secondary">Save & Pause</button>
        <button @click="showGameStats" class="btn btn-secondary">View Stats</button>
        <button @click="endGame" class="btn btn-danger">End Game</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import CardDisplay from './CardDisplay.vue'
import PlayerList from './PlayerList.vue'
import TimerComponent from './TimerComponent.vue'

export default {
  name: 'GameController',
  components: {
    CardDisplay,
    PlayerList,
    TimerComponent
  },
  props: {
    players: {
      type: Array,
      required: true
    },
    cards: {
      type: Array,
      required: true
    }
  },
  emits: ['game-finished', 'save-game'],
  setup(props, { emit }) {
    const currentPlayerIndex = ref(0)
    const currentCardIndex = ref(0)
    const cardFlipped = ref(false)
    const taskCompleted = ref(false)
    const lastTaskSuccess = ref(false)
    const showMenu = ref(false)
    const timerStopped = ref(false)

    const currentPlayer = computed(() => props.players[currentPlayerIndex.value])
    const currentCard = computed(() => props.cards[currentCardIndex.value])

    const flipCard = () => {
      cardFlipped.value = true
      // Auto-complete multiple choice challenges when card is flipped
      if (currentCard.value.type === 'challenge' && currentCard.value.options) {
        // For multiple choice, we just show the card and let them select
      }
    }

    const handleAnswer = (selectedIndex) => {
      // For multiple choice challenges
      if (currentCard.value.type === 'challenge' && currentCard.value.options) {
        const isCorrect = selectedIndex === currentCard.value.correctAnswerIndex
        completeTask(isCorrect)
      }
    }

    const completeTask = (success) => {
      lastTaskSuccess.value = success
      taskCompleted.value = true
      
      // Update player stats
      if (success) {
        currentPlayer.value.completedTasks++
      } else {
        currentPlayer.value.failedTasks++
        currentPlayer.value.drinks++
      }
      
      emit('save-game')
    }

    const handleTimerFinished = () => {
      if (!taskCompleted.value) {
        completeTask(false)
      }
    }

    const nextTurn = () => {
      // Move to next card
      currentCardIndex.value++
      
      // Check if game is finished
      if (currentCardIndex.value >= props.cards.length) {
        endGame()
        return
      }
      
      // Move to next player
      currentPlayerIndex.value = (currentPlayerIndex.value + 1) % props.players.length
      
      // Reset state for next turn
      cardFlipped.value = false
      taskCompleted.value = false
      lastTaskSuccess.value = false
      timerStopped.value = false
      
      emit('save-game')
    }

    const pauseGame = () => {
      emit('save-game')
      showMenu.value = false
    }

    const showGameStats = () => {
      const stats = {
        totalCardsPlayed: currentCardIndex.value,
        totalCards: props.cards.length,
        players: props.players.map(player => ({
          ...player,
          successRate: player.completedTasks + player.failedTasks > 0 
            ? Math.round((player.completedTasks / (player.completedTasks + player.failedTasks)) * 100)
            : 0
        }))
      }
      
      emit('game-finished', stats)
    }

    const endGame = () => {
      const stats = {
        totalCardsPlayed: currentCardIndex.value,
        totalCards: props.cards.length,
        gameCompleted: currentCardIndex.value >= props.cards.length,
        players: props.players.map(player => ({
          ...player,
          successRate: player.completedTasks + player.failedTasks > 0 
            ? Math.round((player.completedTasks / (player.completedTasks + player.failedTasks)) * 100)
            : 0
        }))
      }
      
      emit('game-finished', stats)
    }

    return {
      currentPlayerIndex,
      currentCardIndex,
      cardFlipped,
      taskCompleted,
      lastTaskSuccess,
      showMenu,
      timerStopped,
      currentPlayer,
      currentCard,
      flipCard,
      handleAnswer,
      completeTask,
      handleTimerFinished,
      nextTurn,
      pauseGame,
      showGameStats,
      endGame
    }
  }
}
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.game-header {
  text-align: center;
  margin-bottom: 1rem;
}

.game-progress {
  margin: 1rem 0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: #fbbf24;
  transition: width 0.3s ease;
}

.card-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1rem 0;
}

.action-area {
  margin-top: auto;
  padding: 1rem 0;
}

.task-actions,
.quest-actions,
.movement-actions,
.open-challenge-actions {
  display: flex;
  gap: 0.5rem;
}

.task-result {
  text-align: center;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.success-message {
  color: #10b981;
  font-size: 1.2rem;
  font-weight: bold;
}

.failure-message {
  color: #ef4444;
  font-size: 1.2rem;
  font-weight: bold;
}

.game-menu {
  position: relative;
  text-align: center;
  margin-top: 1rem;
}

.menu-dropdown {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
  margin-bottom: 1rem;
}

.menu-dropdown .btn {
  color: #1f2937;
}

@media (max-width: 480px) {
  .game-container {
    padding: 0.5rem;
  }
  
  .task-actions,
  .quest-actions,
  .movement-actions,
  .open-challenge-actions {
    flex-direction: column;
  }
}
</style>