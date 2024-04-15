import { Link } from "react-router-dom";
import LineChart from "../components/LineChart";
import { useEffect, useState } from "react";

const Analyze = () => {
  const [history, setHistory] = useState();
  const [historyData, setHistoryData] = useState();
  const [currentItem, setCurrentItem] = useState();
  const [failTop10Items, setFailTop10Items] = useState();

  const [chartData, setCharData] = useState();
  const localData = JSON.parse(localStorage.getItem("randomXLXS"));
  const selectList = localData ? Object.keys(localData)?.map((it) => it) : [];

  const failItemTopTen = (currentTopic) => {
    const failItemsCount = {};

    const allFailItems = localData[currentTopic]
      .map((it) => it.failItems)
      .flat(2);

    allFailItems.forEach((item) => {
      failItemsCount[item?.id] = failItemsCount[item?.id]
        ? {
            ...failItemsCount[item?.id],
            quantity: failItemsCount[item?.id]?.quantity + 1,
          }
        : { ...item, createAt: failItemsCount[item?.id]?.timeAt, quantity: 1 };
    });
    return failItemsCount;
  };

  useEffect(() => {
    if (!selectList.length) return;
    setHistory(selectList);
    setHistoryData({
      labels: Object?.entries(localData[selectList[0]])?.map(([key, val]) =>
        new Date(val?.timeAt).toLocaleString()
      ),
      datasets: [
        {
          label: selectList[0],
          data: Object?.entries(localData[selectList[0]])?.map(
            ([key, val]) => val?.passPercentage
          ),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    });
    setCurrentItem(selectList[0]);
    setFailTop10Items(failItemTopTen(selectList[0]));
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
            <span className="label-text">選擇題庫 </span>
          </div>
          <select
            onChange={(e) => {
              setCurrentItem(e.target.value);
              setHistoryData({
                labels: Object?.entries(localData[e.target.value])?.map(
                  ([key, val]) => new Date(val?.timeAt).toLocaleString()
                ),
                datasets: [
                  {
                    label: e.target.value,
                    data: Object?.entries(localData[e.target.value])?.map(
                      ([key, val]) => val?.passPercentage
                    ),
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1,
                  },
                ],
              });
              setFailTop10Items(failItemTopTen(e.target.value));
            }}
            className="select select-bordered"
          >
            {history?.map((it, index) => (
              <option key={index} value={it}>
                {it}
              </option>
            ))}
          </select>
        </label>
      </section>
      {/* 多次錯誤題目 */}
      <section className="mb-6">
        <LineChart data={historyData} />
      </section>
      <section className="border p-2 rounded-md">
        <h1 className="font-bold text-xl">錯誤前 10 題庫:{currentItem} </h1>
        <ul className="flex flex-col gap-2 p-2">
          {failTop10Items &&
            Object?.entries(failTop10Items)
              .map(([key, val], index) => (
                <li className="border rounded-md flex" key={val?.id}>
                  <div className="border-r py-4 px-2 w-[32px] text-center">
                    {index + 1}
                  </div>
                  <div className="border-r p-4">X</div>
                  <div className="p-4">{val?.title}</div>
                </li>
              ))
              .slice(0, 10)}
        </ul>
      </section>
    </main>
  );
};

export default Analyze;
