import axios from "axios";
import type {MealEntry} from "@/types/meal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAllMeals(): Promise<MealEntry[]> {
const response = await axios.get<MealEntry[]>(`${API_BASE_URL}/meals`)
  return response.data
}

export async function createMeal(meal: Omit<MealEntry, "id">): Promise<MealEntry> {
  const response = await axios.post<MealEntry>(`${API_BASE_URL}/meals`, meal)
  return response.data
}

export async function deleteMeal(id: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/meals/${id}`)
}
