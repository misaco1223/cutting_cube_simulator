import InteractiveCube from "../features/getCoordinates/components/ui/InteractiveCube";

const Home = () => {
  return(
    <div>
      <h1 className="text-3xl font-bold underline">立方体の切断</h1>
      <InteractiveCube />
    </div>
  );
};

export default Home;