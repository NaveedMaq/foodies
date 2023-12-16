import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import { S3 } from "@aws-sdk/client-s3";
import { v4 } from "uuid";

import { Meal } from "@/types/commonTypes";
import { MealFormData } from "./meals.types";
import { S3_FOOD_IMAGE_BUCKET } from "@/constants/s3.constants";

const s3 = new S3({
  region: "us-east-1",
});
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
  const filename = `uploaded-${slug}_${v4()}.${extension}`;

  const bufferedImage = await mealFormData.image?.arrayBuffer();
  if (!bufferedImage) return;

  //  Save to local file system
  // const stream = fs.createWriteStream(`public/images/${filename}`);
  // stream.write(Buffer.from(bufferedImage), (error) => {
  //   if (error) throw new Error("Saving image failed!");
  // });

  // Save to AWS S3
  s3.putObject({
    Bucket: S3_FOOD_IMAGE_BUCKET,
    Key: filename,
    Body: Buffer.from(bufferedImage),
    ContentType: mealFormData.image?.type,
  });

  const meal: Omit<Meal, "id"> = {
    title: mealFormData.title as string,
    slug,
    image: filename,
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
