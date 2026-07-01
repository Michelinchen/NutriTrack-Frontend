<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import type {Macronutrient, MealEntry} from "@/types/meal";
import {getAllMeals, createMeal, deleteMeal, updateMeal} from "@/services/mealService";

const meals = ref<MealEntry[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

// Form-State
const newName= ref("")
const newCarbs = ref(0)
const newFat = ref(0)
const newProteins = ref(0)
const editingMealId = ref<number | null>(null)
const searchText = ref("")
const filteredMeals = computed(() =>
  meals.value.filter(meal =>
    meal.name.toLowerCase().includes(searchText.value.toLowerCase())
  )
)
async function loadMeals(){
  isLoading.value = true
  try {
    meals.value = await getAllMeals()
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
      await updateMeal(editingMealId.value, mealData)
    } else {
      await createMeal(mealData)
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
    await deleteMeal(meal.id)
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
    await updateMeal(meal.id, {...meal, favorite: !meal.favorite})
    await loadMeals()
  } catch (error) {
    errorMessage.value = "Fehler beim Aktualisieren des Favoriten-Status."
    console.error(error)
  }
}
function calculateCalories(macro: Macronutrient): number{
  return macro.countFat * 9 + macro.countProteins * 4 + macro.countCarbs * 4
}

onMounted(loadMeals)
</script>

<template>
<div>
  <h2>Meine Mahlzeiten</h2>

  <form @submit.prevent="submitForm">
    <h3>Neue Mahlzeit hinzufügen</h3>
    <input v-model="newName" placeholder="Name" required />
    <input v-model.number="newCarbs" type="number" placeholder="Kohlenhydrate (g)" />
    <input v-model.number="newFat" type="number" placeholder="Fett (g)" />
    <input v-model.number="newProteins" type="number" placeholder="Proteine (g)" />
    <button type="submit">
      {{editingMealId !== null ? "Aktualisieren" : "Speichern"}}
    </button>
    <button v-if="editingMealId !== null"
            type="button"
            @click="resetForm">
      Abbrechen
    </button>
  </form>

  <input v-model="searchText" placeholder="Suchen..." />

  <p v-if="isLoading">Lade Mahlzeiten...</p>
  <p v-else-if="errorMessage">{{ errorMessage }}</p>
  <ul v-else>
    <li v-for="meal in filteredMeals" :key="meal.id ?? meal.name">
      <h3>{{ meal.name}}</h3>
      <p>Kohlenhydrate: {{ meal.macro.countCarbs}} g</p>
      <p>Fette: {{ meal.macro.countFat}} g</p>
      <p>Proteine: {{ meal.macro.countProteins}} g</p>
      <p>Kalorien: {{ calculateCalories(meal.macro) }} kcal</p>
      <button @click="onDelete(meal)" >Löschen</button>
      <button @click="onEdit(meal)" >Bearbeiten</button>
      <button @click="onToggleFavorite(meal)" > {{ meal.favorite ? "⭐" : "☆" }}</button>
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
