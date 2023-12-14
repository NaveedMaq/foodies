export interface MealsDetailsPageProps {
  params: {
    mealSlug: string;
  };
}

export default function MealsDetailsPage(props: MealsDetailsPageProps) {
  const {
    params: { mealSlug },
  } = props;
  return <h1>{mealSlug}</h1>;
}
