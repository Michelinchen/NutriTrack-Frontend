import axios from "axios";
import type {MealEntry} from "@/types/meal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAllMeals(): Promise<MealEntry[]> {
const response = await axios.get<MealEntry[]>(`${API_BASE_URL}/meals`)
  return response.data
}
