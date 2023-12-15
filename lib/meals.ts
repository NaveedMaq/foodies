import { Meal } from "@/types/commonTypes";
import sql from "better-sqlite3";

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  // throw new Error("Loading meals failed");
  return db.prepare("SELECT * FROM meals").all() as Meal[];
}

export function getMeal(slug: string) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug) as Meal;
}
