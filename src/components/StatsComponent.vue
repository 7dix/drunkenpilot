<template>
  <div class="stats-container">
    <h1 class="title">🏆 Game Results</h1>
    
    <div class="stats-card">
      <!-- Game Overview -->
      <div class="game-overview">
        <h2 class="pirate-font" style="font-size: 1.5rem; margin-bottom: 1rem; color: #1e3a8a;">
          Adventure Summary
        </h2>
        
        <div class="overview-stats">
          <div class="stat-item">
            <span class="stat-icon">🃏</span>
            <span class="stat-label">Cards Played:</span>
            <span class="stat-value">{{ gameStats.totalCardsPlayed }} / {{ gameStats.totalCards }}</span>
          </div>
          
          <div class="stat-item" v-if="gameStats.gameCompleted">
            <span class="stat-icon">✅</span>
            <span class="stat-label">Status:</span>
            <span class="stat-value success">Game Completed!</span>
          </div>
          
          <div class="stat-item" v-else>
            <span class="stat-icon">⏸️</span>
            <span class="stat-label">Status:</span>
            <span class="stat-value warning">Game Paused</span>
          </div>
        </div>
      </div>

      <!-- Player Rankings -->
      <div class="player-rankings">
        <h3 style="margin-bottom: 1rem; color: #374151;">🏴‍☠️ Crew Performance</h3>
        
        <div class="ranking-list">
          <div 
            v-for="(player, index) in sortedPlayers" 
            :key="index"
            class="ranking-item"
            :class="{ 
              winner: index === 0 && mostSuccessful,
              loser: index === sortedPlayers.length - 1 && mostDrunk
            }"
          >
            <div class="rank">
              <span v-if="index === 0 && mostSuccessful" class="rank-icon">👑</span>
              <span v-else-if="index === sortedPlayers.length - 1 && mostDrunk" class="rank-icon">🍺</span>
              <span v-else class="rank-number">#{{ index + 1 }}</span>
            </div>
            
            <div class="player-details">
              <div class="player-name">{{ player.name }}</div>
              <div class="player-achievements">
                <span v-if="index === 0 && mostSuccessful" class="achievement">
                  🎯 Most Successful Pirate
                </span>
                <span v-else-if="index === sortedPlayers.length - 1 && mostDrunk" class="achievement">
                  🍻 Thirstiest Pirate
                </span>
              </div>
            </div>
            
            <div class="player-stats">
              <div class="stat-group">
                <span class="stat-mini">
                  <span class="stat-icon">✅</span>
                  {{ player.completedTasks || 0 }}
                </span>
                <span class="stat-mini">
                  <span class="stat-icon">🍻</span>
                  {{ player.drinks || 0 }}
                </span>
                <div class="success-rate">
                  {{ player.successRate || 0 }}% success
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fun Facts -->
      <div class="fun-facts" v-if="funFacts.length > 0">
        <h3 style="margin-bottom: 1rem; color: #374151;">🎉 Fun Facts</h3>
        <div class="facts-list">
          <div v-for="(fact, index) in funFacts" :key="index" class="fact-item">
            {{ fact }}
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button 
          v-if="!gameStats.gameCompleted"
          @click="continueGame"
          class="btn"
          style="width: 100%; margin-bottom: 1rem;"
        >
          Continue Adventure
        </button>
        
        <button 
          @click="newGame"
          class="btn btn-secondary"
          style="width: 100%;"
        >
          {{ gameStats.gameCompleted ? 'New Adventure' : 'Start Over' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'StatsComponent',
  props: {
    players: {
      type: Array,
      required: true
    },
    gameStats: {
      type: Object,
      required: true
    }
  },
  emits: ['new-game', 'continue-game'],
  setup(props, { emit }) {
    const sortedPlayers = computed(() => {
      return [...props.gameStats.players || props.players].sort((a, b) => {
        // Primary sort: success rate
        if (b.successRate !== a.successRate) {
          return b.successRate - a.successRate
        }
        // Secondary sort: completed tasks
        if (b.completedTasks !== a.completedTasks) {
          return b.completedTasks - a.completedTasks
        }
        // Tertiary sort: fewer drinks (better)
        return a.drinks - b.drinks
      })
    })

    const mostSuccessful = computed(() => {
      return sortedPlayers.value.length > 1 && 
             sortedPlayers.value[0].successRate > sortedPlayers.value[1].successRate
    })

    const mostDrunk = computed(() => {
      if (sortedPlayers.value.length < 2) return false
      const last = sortedPlayers.value[sortedPlayers.value.length - 1]
      const secondLast = sortedPlayers.value[sortedPlayers.value.length - 2]
      return last.drinks > secondLast.drinks && last.drinks > 0
    })

    const funFacts = computed(() => {
      const facts = []
      const totalDrinks = sortedPlayers.value.reduce((sum, p) => sum + (p.drinks || 0), 0)
      const totalTasks = sortedPlayers.value.reduce((sum, p) => sum + (p.completedTasks || 0) + (p.failedTasks || 0), 0)
      
      if (totalDrinks > 0) {
        facts.push(`🍻 The crew took a total of ${totalDrinks} sips during this adventure!`)
      }
      
      if (totalTasks > 0) {
        const successRate = Math.round((sortedPlayers.value.reduce((sum, p) => sum + (p.completedTasks || 0), 0) / totalTasks) * 100)
        facts.push(`📊 Overall crew success rate: ${successRate}%`)
      }
      
      const perfectPlayers = sortedPlayers.value.filter(p => p.drinks === 0 && (p.completedTasks || 0) > 0)
      if (perfectPlayers.length > 0) {
        facts.push(`🌟 ${perfectPlayers.map(p => p.name).join(' and ')} completed the adventure without a single sip!`)
      }
      
      return facts
    })

    const continueGame = () => {
      emit('continue-game')
    }

    const newGame = () => {
      emit('new-game')
    }

    return {
      sortedPlayers,
      mostSuccessful,
      mostDrunk,
      funFacts,
      continueGame,
      newGame
    }
  }
}
</script>

<style scoped>
.stats-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.stats-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  color: #1f2937;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.game-overview {
  margin-bottom: 2rem;
  text-align: center;
}

.overview-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 8px;
}

.stat-icon {
  font-size: 1.2rem;
}

.stat-label {
  font-weight: 500;
  flex: 1;
}

.stat-value {
  font-weight: bold;
}

.stat-value.success {
  color: #10b981;
}

.stat-value.warning {
  color: #f59e0b;
}

.player-rankings {
  margin-bottom: 2rem;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid transparent;
}

.ranking-item.winner {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-color: #f59e0b;
}

.ranking-item.loser {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  border-color: #ef4444;
}

.rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #e5e7eb;
  border-radius: 50%;
  font-weight: bold;
}

.rank-icon {
  font-size: 1.5rem;
}

.rank-number {
  color: #374151;
}

.player-details {
  flex: 1;
}

.player-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
}

.achievement {
  font-size: 0.8rem;
  color: #6b7280;
  font-style: italic;
}

.player-stats {
  text-align: right;
}

.stat-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
}

.stat-mini {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
}

.success-rate {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

.fun-facts {
  margin-bottom: 2rem;
}

.facts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fact-item {
  padding: 0.8rem;
  background: #f0f9ff;
  border-radius: 8px;
  font-size: 0.9rem;
  border-left: 4px solid #3b82f6;
}

.action-buttons {
  margin-top: 2rem;
}

@media (max-width: 480px) {
  .stats-container {
    padding: 1rem 0.5rem;
  }
  
  .stats-card {
    padding: 1.5rem;
  }
  
  .ranking-item {
    padding: 0.8rem;
    flex-wrap: wrap;
  }
  
  .player-stats {
    text-align: left;
    width: 100%;
    margin-top: 0.5rem;
  }
  
  .stat-group {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>