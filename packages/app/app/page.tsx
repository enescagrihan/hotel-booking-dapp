import { Wrapper } from "./components/Wrapper";
import { Greeting } from "./components/Greeting";
import Showcase from "./components/Showcase";
import Featured from "./components/Featured";
import Suggestions from "./components/Suggestions";

const Home = () => {
  return (
    <main>
      {/* <Wrapper> */}
      <Showcase />
      <Featured />
      <Suggestions />
      {/* <Greeting /> */}
      {/* </Wrapper> */}
    </main>
  );
};

export default Home;
