<template>
  <div class="card-display">
    <div class="card-flip" :class="{ flipped: isFlipped }">
      <div class="card-flip-inner">
        <!-- Front of card (before flip) -->
        <div class="card-flip-front">
          <div class="card-back-content">
            <h2 class="pirate-font" style="font-size: 2.5rem; margin-bottom: 1rem;">
              🏴‍☠️
            </h2>
            <p style="font-size: 1.2rem; opacity: 0.9;">
              Tap to reveal your fate!
            </p>
            <div class="card-decoration">
              <span style="font-size: 1.5rem;">⚓ ⚔️ ⚓</span>
            </div>
          </div>
        </div>
        
        <!-- Back of card (after flip) -->
        <div class="card-flip-back">
          <div class="card-content">
            <!-- Card Type Badge -->
            <div class="card-type-badge" :class="card.type">
              <span v-if="card.type === 'quest'">🏖️ Beach Quest</span>
              <span v-else-if="card.type === 'challenge'">🧠 Knowledge Challenge</span>
              <span v-else-if="card.type === 'movement'">🏃 Movement Task</span>
            </div>
            
            <!-- Card Text -->
            <div class="card-text">
              <p>{{ card.text }}</p>
            </div>
            
            <!-- Answer Options (for multiple choice challenges) -->
            <div v-if="card.options && isFlipped" class="answer-options">
              <h4 style="margin-bottom: 1rem; color: #374151;">Choose the correct answer:</h4>
              <div class="options-grid">
                <button
                  v-for="(option, index) in card.options"
                  :key="index"
                  @click="selectAnswer(index)"
                  :class="{ 
                    selected: selectedAnswer === index,
                    correct: showCorrectAnswer && index === card.correctAnswerIndex,
                    incorrect: showCorrectAnswer && selectedAnswer === index && index !== card.correctAnswerIndex
                  }"
                  class="option-button"
                  :disabled="selectedAnswer !== null"
                >
                  <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
                  <span class="option-text">{{ option }}</span>
                </button>
              </div>
            </div>
            
            <!-- Quest Timer Info -->
            <div v-if="card.type === 'quest' && card.metadata?.timer" class="quest-info">
              <p class="timer-info">
                ⏱️ Time limit: {{ card.metadata.timer }} seconds
              </p>
            </div>
            
            <!-- Difficulty Badge -->
            <div v-if="card.metadata?.difficulty" class="difficulty-badge" :class="card.metadata.difficulty">
              {{ card.metadata.difficulty.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'CardDisplay',
  props: {
    card: {
      type: Object,
      required: true
    },
    isFlipped: {
      type: Boolean,
      default: false
    },
    isQuest: {
      type: Boolean,
      default: false
    }
  },
  emits: ['flip-card', 'answer-selected'],
  setup(props, { emit }) {
    const selectedAnswer = ref(null)
    const showCorrectAnswer = ref(false)

    // Reset state when card changes
    watch(() => props.card, () => {
      selectedAnswer.value = null
      showCorrectAnswer.value = false
    })

    const selectAnswer = (index) => {
      if (selectedAnswer.value !== null) return
      
      selectedAnswer.value = index
      showCorrectAnswer.value = true
      
      // Emit the selected answer after a short delay to show the result
      setTimeout(() => {
        emit('answer-selected', index)
      }, 1500)
    }

    return {
      selectedAnswer,
      showCorrectAnswer,
      selectAnswer
    }
  }
}
</script>

<style scoped>
.card-display {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
}

.card-flip {
  perspective: 1000px;
  cursor: pointer;
}

.card-flip-inner {
  position: relative;
  width: 100%;
  min-height: 320px;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-flip.flipped .card-flip-inner {
  transform: rotateY(180deg);
  cursor: default;
}

.card-flip-front, .card-flip-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.card-flip-front {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  color: white;
}

.card-flip-back {
  background: rgba(255, 255, 255, 0.98);
  color: #1f2937;
  transform: rotateY(180deg);
  overflow-y: auto;
}

.card-back-content {
  text-align: center;
}

.card-decoration {
  margin-top: 2rem;
  opacity: 0.7;
}

.card-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-type-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
}

.card-type-badge.quest {
  background: #d1fae5;
  color: #065f46;
}

.card-type-badge.challenge {
  background: #dbeafe;
  color: #1e40af;
}

.card-type-badge.movement {
  background: #fed7d7;
  color: #9b2c2c;
}

.card-text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 1rem 0;
}

.card-text p {
  font-size: 1.2rem;
  line-height: 1.5;
  font-weight: 500;
}

.answer-options {
  margin-top: 1rem;
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-button {
  display: flex;
  align-items: center;
  padding: 0.8rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.option-button:hover:not(:disabled) {
  border-color: #3b82f6;
  background: #f8fafc;
}

.option-button.selected {
  border-color: #3b82f6;
  background: #dbeafe;
}

.option-button.correct {
  border-color: #10b981;
  background: #d1fae5;
  color: #065f46;
}

.option-button.incorrect {
  border-color: #ef4444;
  background: #fee2e2;
  color: #991b1b;
}

.option-button:disabled {
  cursor: not-allowed;
}

.option-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #374151;
  color: white;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: bold;
  margin-right: 0.8rem;
  flex-shrink: 0;
}

.option-button.correct .option-letter {
  background: #10b981;
}

.option-button.incorrect .option-letter {
  background: #ef4444;
}

.option-text {
  flex: 1;
  font-size: 0.9rem;
}

.quest-info {
  margin-top: 1rem;
  text-align: center;
}

.timer-info {
  color: #f59e0b;
  font-weight: bold;
  font-size: 0.9rem;
}

.difficulty-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
}

.difficulty-badge.easy {
  background: #d1fae5;
  color: #065f46;
}

.difficulty-badge.medium {
  background: #fef3c7;
  color: #92400e;
}

.difficulty-badge.hard {
  background: #fee2e2;
  color: #991b1b;
}

@media (max-width: 480px) {
  .card-display {
    padding: 0.5rem;
  }
  
  .card-flip-front, .card-flip-back {
    padding: 1.5rem;
  }
  
  .card-flip-inner {
    min-height: 280px;
  }
  
  .card-text p {
    font-size: 1.1rem;
  }
  
  .option-button {
    padding: 0.6rem;
  }
  
  .option-text {
    font-size: 0.85rem;
  }
}
</style>