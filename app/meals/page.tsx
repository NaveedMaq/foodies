import Link from "next/link";
import classes from "./page.module.css";
import { Loader, MealsGrid } from "@/components";
import { getMeals } from "@/lib/meals";
import { Suspense } from "react";
import { Meal } from "@/types/commonTypes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Meals",
  description: "Browse the delicious meals shared by our vibrant community",
};

async function Meals() {
  console.log("Fetchnig meals");
  const meals = (await getMeals()) as Meal[];
  return <MealsGrid meals={meals} />;
}

export default function MealsPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meals, created{" "}
          <span className={classes.highlight}>by you</span>
        </h1>
        <p>
          Choose your favorite recipe and cook it yourself. It is easy and fun!
        </p>

        <p className={classes.cta}>
          <Link href="/meals/share">Share Your Favorite Recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense fallback={<Loader msg="Fetching meals..." />}>
          <Meals />
        </Suspense>
      </main>
    </>
  );
}
