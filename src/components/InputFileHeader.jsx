import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import shuffle from "../utils/shuffle";
import AnalyzeBar from "./AnalyzeBar";

import { read } from "xlsx";

const InputFileHeader = ({
  watch,
  userAnswer,
  setUserAnswer,
  showAnswer,
  setShowAnswer,
  testOpition,
  setTestOpition,
  topicList,
  setTopicList,
  analyzeTabData,
  failItems,
  reset,
}) => {
  //timmer
  //   const [createAt, setCreateAt] = useState();
  //   const [timmer, setTimmer] = useState();

  const navigator = useNavigate();

  const resetBtnRef = useRef();
  const headerRef = useRef();

  const xlxsData = useRef([]);
  let fileName = "";

  const handleToAnalyze = () => {
    if (!showAnswer && topicList.length > 0)
      return document.getElementById("error_modal")?.showModal();
    navigator("/analyze");
  };

  //重新匯入檔案
  const handleReset = () => {
    reset(); //hook empty
    setShowAnswer(false); // disable answer view
    //random topic
    setTopicList(
      shuffle(xlxsData.current).map((it, index) => ({
        ...it,
        topicNumber: index,
      }))
    );

    setUserAnswer([]);

    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth",
    });
  };

  //move fail topic
  const handleFailTopicMove = (topicId, index) => (e) => {
    console.log(topicId);
    const failTopic = document?.querySelector(`#topic-${topicId}`);
    if (!failTopic) return;
    const failTopicBound = failTopic.getBoundingClientRect();
    const headerBound = headerRef.current.getBoundingClientRect();

    if (failTopicBound.top === 0) return;

    window.scrollTo({
      top:
        window.scrollY +
        failTopicBound.top -
        headerBound.height -
        40 -
        innerHeight * 0.25,
      behavior: "smooth",
    });
  };

  //上傳檔案
  const handleFile = (e) => {
    console.log("start change File!");
    //timmer

    //reader
    const reader = new FileReader();
    fileName = e.target?.files[0].name;
    console.log("fileName", fileName);
    reader.readAsArrayBuffer(e.target.files[0]);

    reader.onload = function () {
      const data = new Uint8Array(reader.result);
      const workbook = read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const list = [];

      console.log("sheet", sheet);
      //format sheet to list array
      console.log(sheet?.["!ref"]);
      console.log(sheet?.["!ref"].split(":"));
      const topicChar = sheet?.["!ref"].split(":")[0][0].toLocaleLowerCase();
      const answerChar = sheet?.["!ref"].split(":")[1][0].toLocaleLowerCase();

      Object.entries(sheet).forEach(([key, value], index) => {
        if (index === Object.entries(sheet).length - 1) return;
        const isTitile = key.toLocaleLowerCase().startsWith(topicChar);
        const isAnswer = key.toLocaleLowerCase().startsWith(answerChar);
        const xlsxIndex = parseInt(key.slice(1, key.length)) - 1;
        // console.log(xlsxIndex, key, value);
        list[xlsxIndex] = {
          ...list[xlsxIndex],
          id: xlsxIndex,
          title: isTitile ? value.v : list[xlsxIndex]?.title,
          answer: isAnswer
            ? value.v.toLocaleLowerCase()
            : list[xlsxIndex]?.answer,
        };
      });
      console.log(list);
      //view data
      xlxsData.current = list;

      const radom = shuffle(xlxsData.current).map((it, index) => ({
        ...it,
        topicNumber: index,
      }));

      console.log(radom);

      setTestOpition((pre) => ({
        ...pre,
        topicLength: list.length,
        fileName: e.target?.files[0].name,
      }));
      setTopicList(radom);
      handleReset();
    };
  };

  return (
    //
    <header
      ref={headerRef}
      className="flex flex-col gap-2 my-10 border p-5 rounded-md sticky top-1 backdrop-blur-sm shadow-lg z-30 container mx-auto"
    >
      <div className="flex justify-between">
        <h1 name="head" className="font-bold text-2xl mb-2">
          隨機題目抽測
        </h1>
        <div className="flex gap-2">
          <button
            ref={resetBtnRef}
            onClick={handleReset}
            className="btn btn-sm btn-active"
          >
            重新測驗
          </button>
          {/* 未填寫題目出現於bar下方, 可以轉跳 */}
          <button onClick={handleToAnalyze} className="btn btn-sm btn-active">
            歷史測驗結果
          </button>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          onChange={handleFile}
          type="file"
          className="file-input file-input-bordered file-input-md w-full max-w-xs mb-2"
        />
        <label className="input input-bordered flex items-center gap-2">
          <input
            onChange={(e) =>
              setTestOpition((pre) => ({
                ...pre,
                topicLength: e.target.value
                  ? parseInt(e.target.value)
                  : topicList.length,
              }))
            }
            type="text"
            className="grow"
            placeholder="輸入題數"
            disabled={testOpition.disabled}
            defaultValue={testOpition.topicLength}
          />
        </label>
      </div>
      {/* 統計分數面板 Analyze */}
      <AnalyzeBar
        topicList={topicList}
        testOpition={testOpition}
        showAnswer={showAnswer}
        analyzeTabData={analyzeTabData}
      />
      {/* Timmer  https://daisyui.com/components/countdown/*/}
      {showAnswer && (
        <ul className="flex flex-wrap gap-2 overflow-y-scroll max-h-[162px]">
          {failItems.map((item, index) => (
            <li key={`fail-${item?.id}`}>
              <button
                onClick={handleFailTopicMove(item?.id, index)}
                className="btn btn-error text-white w-[48px]"
              >
                {item?.topicNumber + 1}
              </button>
            </li>
          ))}
        </ul>
      )}
      <dialog id="error_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">未作答完成</h3>
          <p className="py-4">目前未作答完成, 確定要前往數據頁面!</p>
          <button
            onClick={() => navigator("/analyze")}
            className="flex ml-auto btn"
          >
            前往
          </button>
        </div>
      </dialog>
    </header>
  );
};

export default InputFileHeader;
