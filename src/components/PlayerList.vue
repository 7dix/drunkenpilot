<template>
  <div class="player-list-container">
    <div class="player-list">
      <div 
        v-for="(player, index) in players" 
        :key="index"
        class="player-item"
        :class="{ active: index === currentPlayerIndex }"
      >
        <div class="player-info">
          <div class="player-name">
            {{ player.name }}
            <span v-if="index === currentPlayerIndex" class="current-indicator">👑</span>
          </div>
          <div class="player-stats">
            <span class="stat" title="Tasks completed">
              ✅ {{ player.completedTasks || 0 }}
            </span>
            <span class="stat" title="Tasks failed / Drinks taken">
              🍻 {{ player.drinks || 0 }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerList',
  props: {
    players: {
      type: Array,
      required: true
    },
    currentPlayerIndex: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.player-list-container {
  margin: 1rem 0;
}

.player-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.player-item {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 0.8rem;
  min-width: 120px;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 2px solid transparent;
}

.player-item.active {
  background: rgba(251, 191, 36, 0.9);
  color: #1f2937;
  border-color: #f59e0b;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.player-name {
  font-weight: bold;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
}

.current-indicator {
  font-size: 0.8rem;
}

.player-stats {
  display: flex;
  justify-content: space-around;
  gap: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.9;
}

.player-item.active .player-stats {
  opacity: 1;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .player-list {
    flex-direction: column;
    align-items: center;
  }
  
  .player-item {
    width: 100%;
    max-width: 200px;
  }
  
  .player-stats {
    justify-content: center;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .player-item {
    min-width: 100px;
    padding: 0.6rem;
  }
  
  .player-name {
    font-size: 0.8rem;
  }
  
  .player-stats {
    font-size: 0.7rem;
  }
}
</style>