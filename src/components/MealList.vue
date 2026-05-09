<script setup lang="ts">
import { ref } from "vue";
import type {Macronutrient, MealEntry} from "@/types/meal";
const meals = ref<MealEntry[]>([
  {name: "Cheeseburger", macro: {countCarbs: 50, countFat: 10, countProteins: 5}},
  {name: "Pizza", macro: {countCarbs : 100, countFat: 20, countProteins: 10}},
  {name: "Pasta", macro: {countCarbs: 120, countFat: 50, countProteins: 10}}
])

function calculateCalories(macro: Macronutrient): number{
  return macro.countFat * 9 + macro.countProteins * 4 + macro.countCarbs * 4
}
</script>

<template>
<div>
  <h2>Meine Mahlzeiten</h2>
  <ul> <li v-for="meal in meals" :key="meal.name">
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
