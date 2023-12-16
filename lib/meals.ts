import fs from "node:fs";

import { Meal } from "@/types/commonTypes";
import sql from "better-sqlite3";
import { MealFormData } from "./meals.types";
import slugify from "slugify";
import xss from "xss";

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return db.prepare("SELECT * FROM meals").all() as Meal[];
}

export function getMeal(slug: string) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug) as Meal;
}

export async function saveMeal(mealFormData: MealFormData) {
  const slug = slugify(mealFormData.title as string, { lower: true });
  const instructions = xss(mealFormData.instructions as string);

  const extension = mealFormData.image?.name.split(".").pop();
  if (!extension) return;
  const filename = `uploaded-${slug}_${new Date().getTime()}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${filename}`);

  const bufferedImage = await mealFormData.image?.arrayBuffer();
  if (!bufferedImage) return;
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) throw new Error("Saving image failed!");
  });

  const meal: Omit<Meal, "id"> = {
    title: mealFormData.title as string,
    slug,
    image: `/images/${filename}`,
    summary: mealFormData.summary as string,
    creator: mealFormData.creator as string,
    creator_email: mealFormData.creator_email as string,
    instructions,
  };

  db.prepare(
    `
    INSERT INTO meals 
      (title, summary, instructions,creator, creator_email, image, slug)
      VALUES (
        @title,
        @summary,
        @instructions,
        @creator,
        @creator_email,
        @image,
        @slug
      )
  `
  ).run(meal);
}
