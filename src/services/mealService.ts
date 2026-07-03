import axios from "axios";
import type {MealEntry} from "@/types/meal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAllMeals(owner: string | undefined): Promise<MealEntry[]> {
const response = await axios.get<MealEntry[]>(`${API_BASE_URL}/meals`, {
  params: {
    Owner: owner
  }
})
  return response.data
}

export async function createMeal(meal: Omit<MealEntry, "id">, owner: string | undefined): Promise<MealEntry> {
  const response = await axios.post<MealEntry>(`${API_BASE_URL}/meals`, meal, {
    params: {
      Owner: owner
    }
  })
  return response.data
}

export async function deleteMeal(id: number, owner: string | undefined): Promise<void> {
  await axios.delete(`${API_BASE_URL}/meals/${id}`, {
    params: {
      Owner: owner
    }
  })
}

export async function updateMeal(id: number, meal: MealEntry, owner: string | undefined): Promise<MealEntry>{
  const response = await axios.put<MealEntry>(`${API_BASE_URL}/meals/${id}`, meal, {
    params: {
      Owner: owner
    }
  })
  return response.data
}
