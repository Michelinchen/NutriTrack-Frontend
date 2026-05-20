<script setup lang="ts">
import { ref, onMounted } from "vue";
import type {Macronutrient, MealEntry} from "@/types/meal";
import {getAllMeals} from "@/services/mealService";

const meals = ref<MealEntry[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

onMounted(async() => {
  try {
    meals.value = await getAllMeals()
  } catch (error) {
    errorMessage.value = "Error while loading meals."
    console.error(error)
  }finally {
    isLoading.value = false
  }
})

function calculateCalories(macro: Macronutrient): number{
  return macro.countFat * 9 + macro.countProteins * 4 + macro.countCarbs * 4
}
</script>

<template>
<div>
  <h2>Meine Mahlzeiten</h2>
  <p v-if="isLoading">Lade Mahlzeiten...</p>
  <p v-else-if="errorMessage">{{ errorMessage }}</p>
  <ul v-else>
    <li v-for="meal in meals" :key="meal.name">
    <h3>{{ meal.name}}</h3>
    <p>Kohlenhydrate: {{ meal.macro.countCarbs}} g</p>
    <p>Fette: {{ meal.macro.countFat}} g</p>
    <p>Proteine: {{ meal.macro.countProteins}} g</p>
    <p>Kalorien: {{ calculateCalories(meal.macro) }} kcal</p>
  </li> </ul>
</div>
</template>

<style scoped>

</style>
