export interface Macronutrient {
  countCarbs: number,
  countProteins: number,
  countFat: number
}
export interface MealEntry {
  name: string,
  macro: Macronutrient
}
