import { Link } from "react-router-dom";
import LineChart from "../components/LineChart";

const Analyze = () => {
  return (
    <main>
      <Link to="/">HomePage</Link>
      <h1>Analyze</h1>
      {/* Test FC */}
      <LineChart />
    </main>
  );
};

export default Analyze;
