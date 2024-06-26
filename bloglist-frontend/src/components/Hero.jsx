import heroStyles from "../styles/hero.module.css";


export const Hero = () => {
  return (
    <div>
      <div className={heroStyles["hero-container"]}>
        <h1 className={heroStyles["hero-title"]}>
          Welcome to <span className={heroStyles["highlight"]}>DEV Blog</span>
        </h1>
        <p className={heroStyles["hero-description"]}>
          A platform to share experiences and knowledge
        </p>
      </div>
    </div>
  );
};
