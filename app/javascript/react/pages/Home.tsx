import InteractiveCube from "../features/getCoordinates/components/ui/InteractiveCube";
import ScrollMessage from "./ScrollMessage"

const Home = () => {
  return(
    <>
      <ScrollMessage/>
      <div className="container mx-auto mt-4 px-5 mb-24">
        <InteractiveCube />
      </div>
    </>
  );
};

export default Home;