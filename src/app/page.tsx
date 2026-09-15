import Hero from "./sections/hero";
import ShopPreview from "./sections/shop-preview";

export default function Home() {
  return (
    <>
      <Hero />
      <main id="main">
        <ShopPreview />
      </main>
    </>
  );
}