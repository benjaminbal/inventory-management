<template>
  <div class="restocking">
    <div class="page-header">
      <h2>Restocking Planner</h2>
      <p>Optimize your inventory replenishment within budget constraints using demand forecasting.</p>
    </div>

    <!-- Budget Slider Card -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Budget Configuration</h3>
      </div>
      <div class="budget-slider-section">
        <div class="budget-label-row">
          <label class="budget-label" for="budget-slider">Restocking Budget</label>
          <span class="budget-value">{{ formatCurrency(budget) }}</span>
        </div>
        <input
          id="budget-slider"
          type="range"
          class="budget-slider"
          :min="10000"
          :max="500000"
          :step="5000"
          v-model.number="budget"
        />
        <div class="slider-range-labels">
          <span>$10,000</span>
          <span>$500,000</span>
        </div>
      </div>
    </div>

    <!-- Budget Summary Bar -->
    <div class="card" v-if="recommendations.length > 0 || recommendationsLoading">
      <div class="budget-summary">
        <div class="budget-summary-text">
          <span class="budget-allocated">Allocated: {{ formatCurrency(totalCost) }}</span>
          <span class="budget-separator">/</span>
          <span class="budget-total">{{ formatCurrency(budget) }} budget</span>
          <span class="budget-remaining">({{ formatCurrency(remainingBudget) }} remaining)</span>
        </div>
        <div class="budget-progress-bar">
          <div
            class="budget-progress-fill"
            :style="{ width: budgetUsedPercent + '%' }"
            :class="{ 'over-budget': budgetUsedPercent >= 100 }"
          ></div>
        </div>
        <div class="budget-percent-label">{{ budgetUsedPercent.toFixed(1) }}% of budget used</div>
      </div>
    </div>

    <!-- Success Banner -->
    <div v-if="orderSuccess" class="success-banner">
      {{ orderSuccess }}
    </div>

    <!-- Error Banner for order submission -->
    <div v-if="orderError" class="error">
      {{ orderError }}
    </div>

    <!-- Recommendations Section -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Restocking Recommendations</h3>
        <button
          class="place-order-btn"
          :disabled="recommendations.length === 0 || submitting"
          @click="placeOrder"
        >
          <span v-if="submitting">Submitting...</span>
          <span v-else>Place Order</span>
        </button>
      </div>

      <div v-if="recommendationsLoading" class="loading">Loading recommendations...</div>
      <div v-else-if="recommendationsError" class="error">{{ recommendationsError }}</div>
      <div v-else-if="recommendations.length === 0" class="empty-state">
        No recommendations available for the selected budget.
      </div>
      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>SKU</th>
              <th>Trend</th>
              <th>Qty to Order</th>
              <th>Unit Cost</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in recommendations" :key="item.sku">
              <td><strong>{{ item.name }}</strong></td>
              <td class="sku-cell">{{ item.sku }}</td>
              <td>
                <span :class="['badge', getTrendClass(item.trend)]">
                  {{ item.trend }}
                </span>
              </td>
              <td>{{ item.quantity.toLocaleString() }}</td>
              <td>{{ formatCurrency(item.unit_cost) }}</td>
              <td><strong>{{ formatCurrency(item.total_cost) }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { api } from '../api'

export default {
  name: 'Restocking',
  setup() {
    // Budget state
    const budget = ref(200000)

    // Recommendations state
    const recommendations = ref([])
    const totalCost = ref(0)
    const remainingBudget = ref(0)
    const recommendationsLoading = ref(false)
    const recommendationsError = ref(null)

    // Order submission state
    const submitting = ref(false)
    const orderSuccess = ref(null)
    const orderError = ref(null)

    // Debounce timer reference
    let debounceTimer = null

    // Computed: percentage of budget used (capped at 100 for display)
    const budgetUsedPercent = computed(() => {
      if (budget.value === 0) return 0
      const pct = (totalCost.value / budget.value) * 100
      return Math.min(pct, 100)
    })

    const formatCurrency = (value) => {
      if (value === null || value === undefined) return '$0'
      return '$' + Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    }

    const getTrendClass = (trend) => {
      const trendMap = {
        'increasing': 'success',
        'stable': 'info',
        'decreasing': 'danger'
      }
      return trendMap[trend] || 'info'
    }

    const loadRecommendations = async () => {
      try {
        recommendationsLoading.value = true
        recommendationsError.value = null
        // Clear previous order notifications when budget changes
        orderSuccess.value = null
        orderError.value = null

        const data = await api.getRestockingRecommendations(budget.value)
        recommendations.value = data.recommendations || []
        totalCost.value = data.total_cost || 0
        remainingBudget.value = data.remaining_budget || 0
      } catch (err) {
        recommendationsError.value = 'Failed to load recommendations: ' + err.message
        recommendations.value = []
        totalCost.value = 0
        remainingBudget.value = 0
      } finally {
        recommendationsLoading.value = false
      }
    }

    const placeOrder = async () => {
      if (recommendations.value.length === 0 || submitting.value) return

      try {
        submitting.value = true
        orderError.value = null
        orderSuccess.value = null

        const orderData = {
          items: recommendations.value,
          budget: budget.value
        }

        const result = await api.submitRestockingOrder(orderData)
        orderSuccess.value = `Order ${result.order_number} submitted! Expected delivery: ${result.expected_delivery}`
      } catch (err) {
        orderError.value = 'Failed to submit order: ' + err.message
      } finally {
        submitting.value = false
      }
    }

    // Watch budget with 500ms debounce
    watch(budget, () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      debounceTimer = setTimeout(() => {
        loadRecommendations()
      }, 500)
    }, { immediate: true })

    return {
      budget,
      recommendations,
      totalCost,
      remainingBudget,
      recommendationsLoading,
      recommendationsError,
      submitting,
      orderSuccess,
      orderError,
      budgetUsedPercent,
      formatCurrency,
      getTrendClass,
      placeOrder
    }
  }
}
</script>

<style scoped>
.restocking {
  /* inherits page layout from main-content */
}

/* Budget slider section */
.budget-slider-section {
  padding: 0.5rem 0;
}

.budget-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.budget-label {
  font-size: 0.938rem;
  font-weight: 600;
  color: #334155;
}

.budget-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
}

.budget-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #e2e8f0;
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  transition: background 0.2s;
}

.budget-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 0 0 1px #2563eb, 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.15s;
}

.budget-slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 2px #2563eb, 0 2px 6px rgba(37, 99, 235, 0.3);
}

.budget-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 0 0 1px #2563eb, 0 2px 4px rgba(0, 0, 0, 0.15);
}

.slider-range-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Budget summary bar */
.budget-summary {
  padding: 0.25rem 0;
}

.budget-summary-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
  font-size: 0.938rem;
  flex-wrap: wrap;
}

.budget-allocated {
  font-weight: 700;
  color: #0f172a;
}

.budget-separator {
  color: #94a3b8;
}

.budget-total {
  color: #334155;
  font-weight: 500;
}

.budget-remaining {
  color: #64748b;
  font-size: 0.875rem;
}

.budget-progress-bar {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.375rem;
}

.budget-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  border-radius: 5px;
  transition: width 0.4s ease;
}

.budget-progress-fill.over-budget {
  background: linear-gradient(90deg, #dc2626, #ef4444);
}

.budget-percent-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  text-align: right;
}

/* Success banner */
.success-banner {
  background: #d1fae5;
  border: 1px solid #6ee7b7;
  color: #065f46;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  font-size: 0.938rem;
  font-weight: 500;
}

/* Place Order button */
.place-order-btn {
  padding: 0.625rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.938rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.place-order-btn:hover:not(:disabled) {
  background: #1d4ed8;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.place-order-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.7;
}

/* SKU cell */
.sku-cell {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.813rem;
  color: #64748b;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-size: 0.938rem;
}
</style>
