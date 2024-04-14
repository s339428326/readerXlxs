import { Link } from "react-router-dom";
import LineChart from "../components/LineChart";
import { useEffect, useState } from "react";

const Analyze = () => {
  const [history, setHistory] = useState();
  const [currentItem, setCurrentItem] = useState();
  const [chartData, setCharData] = useState();
  const localData = JSON.parse(localStorage.getItem("randomXLXS"));
  const selectList = Object.keys(localData).map((it) => it);

  useEffect(() => {
    setHistory(selectList);
    setCurrentItem(selectList[0]);
  }, []);

  return (
    <main className="container mx-auto">
      <section className="flex flex-col gap-2 my-4">
        <Link className="btn mr-auto" to="/">
          返回
        </Link>
        <h1 className="font-bold text-2xl">錯誤分析頁面</h1>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">選擇題庫 {currentItem}</span>
          </div>
          <select
            onChange={(e) => setCurrentItem(e.target.value)}
            className="select select-bordered"
          >
            {/* <option selected>Pick one</option> */}
            {history?.map((it, index) => (
              <option key={index} value={it}>
                {it}
              </option>
            ))}
          </select>
        </label>
      </section>
      {/* 多次錯誤題目 */}
      <section>
        <LineChart />
      </section>
    </main>
  );
};

export default Analyze;
