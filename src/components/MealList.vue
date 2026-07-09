<script setup lang="ts">
import {ref, onMounted, computed, watch} from "vue";
import type {Macronutrient, MealEntry} from "@/types/meal";
import {getAllMeals, createMeal, deleteMeal, updateMeal} from "@/services/mealService";
import {useAuth0} from "@auth0/auth0-vue";

const meals = ref<MealEntry[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const showOnlyFavorites= ref(false)
const { user } = useAuth0()
// Form-State
const newName= ref("")
const newCarbs = ref(0)
const newFat = ref(0)
const newProteins = ref(0)
const editingMealId = ref<number | null>(null)
const searchText = ref("")
const filteredMeals = computed(() =>
  meals.value.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchText.value.toLowerCase())
    const matchesFavorite = !showOnlyFavorites.value || meal.favorite
    return matchesSearch && matchesFavorite
  })
)
const totalCalories = computed(() =>
  filteredMeals.value.reduce((summe, meal) => summe + calculateCalories(meal.macro), 0)
)

async function loadMeals(){
  if (!user.value?.email) return
  isLoading.value = true
  try {
    meals.value = await getAllMeals(user.value?.email)
  } catch (error) {
    errorMessage.value = "Error while loading meals."
    console.error(error)
  }finally {
    isLoading.value = false
  }
}

async function submitForm() {
  if (!newName.value) return
  try {
    const mealData = {
      name: newName.value,
      macro: {
        countCarbs: newCarbs.value,
        countFat: newFat.value,
        countProteins: newProteins.value
      }
    }
    if (editingMealId.value !== null) {
      await updateMeal(editingMealId.value, mealData, user.value?.email)
    } else {
      await createMeal(mealData, user.value?.email)
    }
    resetForm()
    await loadMeals()
  }catch (error) {
    errorMessage.value = "Fehler beim Speichern."
    console.error(error)
  }
}

async function onDelete(meal: MealEntry){
  if(!meal.id) return
  if(!confirm("Wirklich löschen?")) return
  try {
    await deleteMeal(meal.id, user.value?.email)
    await loadMeals()
  } catch (error) {
    errorMessage.value = "Fehler beim Löschen."
    console.error(error)
  }
}

async function onEdit(meal: MealEntry){
  editingMealId.value = meal.id ?? null
  newName.value = meal.name
  newFat.value = meal.macro.countFat
  newCarbs.value = meal.macro.countCarbs
  newProteins.value = meal.macro.countProteins
}

function resetForm(){
  editingMealId.value = null
  newName.value = ""
  newCarbs.value = 0
  newFat.value = 0
  newProteins.value = 0
}

async function onToggleFavorite(meal: MealEntry){
  if(!meal.id) return
  try {
    await updateMeal(meal.id, {...meal, favorite: !meal.favorite}, user.value?.email)
    await loadMeals()
  } catch (error) {
    errorMessage.value = "Fehler beim Aktualisieren des Favoriten-Status."
    console.error(error)
  }
}
function calculateCalories(macro: Macronutrient): number{
  return macro.countFat * 9 + macro.countProteins * 4 + macro.countCarbs * 4
}

watch(user, () => {
  if (user.value?.email) {
    loadMeals()
  }
}, { immediate: true })
</script>

<template>
<div class="container mt-4">
  <h2 class="mb-3 text-success">Meine Mahlzeiten</h2>

  <form @submit.prevent="submitForm" class="card card-body mb-4">
    <h3 class="h5">Neue Mahlzeit hinzufügen</h3>
    <label class="form-label mb-1">Name</label>
    <input v-model="newName" placeholder="Mahlzeit" required class="form-control mb-2" />
    <label class="form-label mb-1">Kohlenhydrate (g)</label>
    <input v-model.number="newCarbs" type="number"  class="form-control mb-2" />
    <label class="form-label mb-1">Fett (g)</label>
    <input v-model.number="newFat" type="number" placeholder="Fett (g)" class="form-control mb-2" />
    <label class="form-label mb-1">Proteine (g)</label>
    <input v-model.number="newProteins" type="number" placeholder="Proteine (g)" class="form-control mb-2" />
    <div class="mb-2">
      <button type="submit" class="btn btn-success me-2">
        {{editingMealId !== null ? "Aktualisieren" : "Speichern"}}
      </button>
      <button v-if="editingMealId !== null"
              type="button"
              class="btn btn-secondary"
              @click="resetForm">
        Abbrechen
      </button>
    </div>
    <label class="form-check">
      <input type="checkbox" class="form-check-input me-1" v-model="showOnlyFavorites" />
      Nur Favoriten anzeigen
    </label>
  </form>

  <input v-model="searchText" placeholder="Suchen..." class="form-control mb-3" />
  <p class="fw-bold">Gesamt (angezeigt): <span class="badge bg-success">{{ totalCalories }} kcal</span></p>
  <p v-if="isLoading">Lade Mahlzeiten...</p>
  <p v-else-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</p>
  <ul v-else class="list-group">
    <li v-for="meal in filteredMeals" :key="meal.id ?? meal.name" class="list-group-item">
      <h3 class="h5">{{ meal.name}}</h3>
      <p class="mb-1">Kohlenhydrate: {{ meal.macro.countCarbs}} g</p>
      <p class="mb-1">Fette: {{ meal.macro.countFat}} g</p>
      <p class="mb-1">Proteine: {{ meal.macro.countProteins}} g</p>
      <p class="mb-2">Kalorien: <span class="badge bg-success">{{ calculateCalories(meal.macro) }} kcal</span></p>
      <button @click="onDelete(meal)" class="btn btn-sm btn-outline-danger me-2">Löschen</button>
      <button @click="onEdit(meal)" class="btn btn-sm btn-outline-primary me-2">Bearbeiten</button>
      <button @click="onToggleFavorite(meal)" class="btn btn-sm btn-outline-warning"> {{ meal.favorite ? "⭐" : "☆" }}</button>
    </li>
  </ul>
</div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  max-width: 300px;
}
</style>
