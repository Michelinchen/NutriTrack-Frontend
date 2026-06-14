export interface Macronutrient {
  countCarbs: number,
  countProteins: number,
  countFat: number
}
export interface MealEntry {
  id?: number
  name: string,
  macro: Macronutrient
}
