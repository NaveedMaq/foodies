import classes from "./loader.module.css";

export default function MealsLoadingPage({ msg }: { msg: string }) {
  return <p className={classes.loading}>{msg}</p>;
}
