<script setup lang="ts">
import { ref, onMounted } from "vue";
import type {Macronutrient, MealEntry} from "@/types/meal";
import {getAllMeals, createMeal, deleteMeal} from "@/services/mealService";

const meals = ref<MealEntry[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

// Form-State
const newName= ref("")
const newCarbs = ref(0)
const newFat = ref(0)
const newProteins = ref(0)

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
    await createMeal({
      name: newName.value,
      macro: {
        countCarbs: newCarbs.value,
        countFat: newFat.value,
        countProteins: newProteins.value,
      },
    })
    // Form zurücksetzen
    newName.value = ""
    newCarbs.value = 0
    newFat.value = 0
    newProteins.value = 0
    // Liste neu laden
    await loadMeals()
  } catch (error) {
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
    <button type="submit">Speichern</button>
  </form>

  <p v-if="isLoading">Lade Mahlzeiten...</p>
  <p v-else-if="errorMessage">{{ errorMessage }}</p>
  <ul v-else>
    <li v-for="meal in meals" :key="meal.id ?? meal.name">
    <h3>{{ meal.name}}</h3>
    <p>Kohlenhydrate: {{ meal.macro.countCarbs}} g</p>
    <p>Fette: {{ meal.macro.countFat}} g</p>
    <p>Proteine: {{ meal.macro.countProteins}} g</p>
    <p>Kalorien: {{ calculateCalories(meal.macro) }} kcal</p>
    <button @click="onDelete(meal)" type="button">Löschen</button>
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
