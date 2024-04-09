import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { read } from "xlsx";
import { Link } from "react-router-dom";

const Home = () => {
  const ENG_OPITIONS = ["A", "B", "C", "D", "E"];
  const OX_OPITIONS = ["O", "X"];
  const [testOpition, setTestOpition] = useState({
    topicLength: 0,
    disabled: false,
  });
  const [showAnswer, setShowAnswer] = useState(false);
  const [topicList, setTopicList] = useState([]);
  const [userAnswer, setUserAnswer] = useState();
  const xlxsData = useRef([]);
  const resetBtnRef = useRef();

  //timmer
  const [createAt, setCreateAt] = useState();
  const [timmer, setTimmer] = useState();

  //hook-from
  const {
    register,
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm();

  //local
  const localData = JSON.parse(localStorage.getItem("randomXLXS"));
  let fileName = "";

  //重新匯入檔案
  const handleReset = () => {
    reset(); //hook empty
    setShowAnswer(false); // disable answer view
    setTopicList(() => shuffle(xlxsData.current)); //random topic
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth",
    });
  };

  //Fisher-Yates Shuffle
  const shuffle = (array) => {
    let result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
    }
    return result;
  };

  const handleFile = (e) => {
    console.log("start change File! 1");
    //timmer

    //reader
    const reader = new FileReader();
    fileName = e.target?.files[0].name;
    reader.readAsArrayBuffer(e.target.files[0]);

    reader.onload = function () {
      const data = new Uint8Array(reader.result);
      const workbook = read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const list = [];

      //sheet
      console.log(sheet?.["!ref"]);
      console.log(sheet?.["!ref"].split(":"));
      const topicChar = sheet?.["!ref"].split(":")[0][0].toLocaleLowerCase();
      const answerChar = sheet?.["!ref"].split(":")[1][0].toLocaleLowerCase();

      Object.entries(sheet).forEach(([key, value], index) => {
        if (index === Object.entries(sheet).length - 1) return;
        const isTitile = key.toLocaleLowerCase().startsWith(topicChar);
        const isAnswer = key.toLocaleLowerCase().startsWith(answerChar);
        const xlsxIndex = parseInt(key.slice(1, key.length)) - 1;
        console.log(xlsxIndex, key, value);
        list[xlsxIndex] = {
          ...list[xlsxIndex],
          id: xlsxIndex,
          title: isTitile ? value.v : list[xlsxIndex]?.title,
          answer: isAnswer
            ? value.v.toLocaleLowerCase()
            : list[xlsxIndex]?.answer,
        };
      });

      //view data
      xlxsData.current = list;
      setTestOpition((pre) => ({ ...pre, topicLength: list.length }));
      setTopicList(() => shuffle(xlxsData.current));
    };
  };

  const onSubmit = (data) => {
    if (!Object.entries(data).length) return;
    //無題目長度 return
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth",
    });
    //錯誤題目紀錄於local
    console.log("對答案", data);
    setUserAnswer(data);

    //顯示對答案模式
    setShowAnswer(true);
  };

  return (
    <main className="container mx-auto">
      <section className="my-10 border p-5 rounded-md sticky top-1 backdrop-blur-sm shadow-lg z-30">
        {/* function bar */}
        <div className="flex justify-between">
          <h1 name="head" className="font-bold text-2xl mb-2">
            隨機題目抽測
          </h1>
          <Link to="/analyze" className="btn btn-sm btn-active">
            歷史測驗結果
          </Link>
        </div>
        <div className="flex gap-2">
          <input
            onChange={handleFile}
            type="file"
            className="file-input file-input-bordered file-input-md w-full max-w-xs mb-2"
          />
          <label
            onChange={(e) =>
              setTestOpition((pre) => ({
                ...pre,
                topicLength: parseInt(e.target.value),
              }))
            }
            className="input input-bordered flex items-center gap-2"
          >
            <input
              type="text"
              className="grow"
              placeholder="輸入題數"
              defaultValue={testOpition.topicLength}
            />
          </label>
        </div>

        <div className="flex gap-2">
          <button
            ref={resetBtnRef}
            onClick={handleReset}
            className="btn btn-sm btn-active"
          >
            重新測驗
          </button>
        </div>

        {/* Timmer  https://daisyui.com/components/countdown/*/}
      </section>
      {/* QA */}
      <section>
        <form onSubmit={handleSubmit(onSubmit)} className="mb-2">
          <ul className="flex flex-col gap-2 p-2">
            {topicList.slice(0, testOpition.topicLength).map((item, index) => (
              <li
                key={index}
                className="flex rounded-md border overflow-hidden"
              >
                {/* Ans. box */}
                <div className="border-r p-2">
                  {item?.answer.length > 1 ? (
                    <input
                      type="text"
                      className="input input-bordered text-center max-w-[128px]"
                      disabled={showAnswer}
                      {...register(`${item?.id}`)}
                    />
                  ) : (
                    <select
                      className="select select-bordered"
                      {...register(`${item?.id}`)}
                      disabled={showAnswer}
                    >
                      <option key={`${item?.id}-null`}></option>
                      {item?.answer.toLocaleLowerCase() !== "o" &&
                      item?.answer.toLocaleLowerCase() !== "x"
                        ? ENG_OPITIONS.map((it) => (
                            <option key={`${item?.id}-${it}`}>{it}</option>
                          ))
                        : OX_OPITIONS.map((it) => (
                            <option key={`${item?.id}-${it}`}>{it}</option>
                          ))}
                    </select>
                  )}
                </div>
                {/* Topic Content */}
                <div className="my-auto p-2">
                  <p className="max-w-[768px]">{item?.title}</p>
                </div>
                {/* Show Ans. area */}
                {showAnswer && (
                  // success error
                  <div
                    className={`${
                      userAnswer?.[item?.id].toLocaleLowerCase() ===
                      item?.answer
                        ? "bg-success"
                        : "bg-error"
                    }  max-w-[56px] flex flex-1 justify-center items-center ml-auto text-white font-bold`}
                  >
                    {item?.answer.toUpperCase()}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="flex">
            <button
              className="btn btn-success btn-primary ml-auto font-bold text-white"
              type="submit"
            >
              對答案
            </button>
          </div>
        </form>
      </section>
      <section></section>
    </main>
  );
};

export default Home;
