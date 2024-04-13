import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import shuffle from "../utils/shuffle";
import AnalyzeBar from "./AnalyzeBar";

import { read } from "xlsx";

const InputFileHeader = ({
  showAnswer,
  setShowAnswer,
  testOpition,
  setTestOpition,
  topicList,
  setTopicList,
  analyzeTabData,
  reset,
}) => {
  //timmer
  const [createAt, setCreateAt] = useState();
  const [timmer, setTimmer] = useState();

  const resetBtnRef = useRef();

  const xlxsData = useRef([]);
  let fileName = "";

  //重新匯入檔案
  const handleReset = () => {
    reset(); //hook empty
    setShowAnswer(false); // disable answer view
    setTopicList(shuffle(xlxsData.current)); //random topic
    setTestOpition((pre) => ({ ...pre, disabled: false }));

    window.scrollTo({
      left: 0,
      top: 0,
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
    reader.readAsArrayBuffer(e.target.files[0]);

    reader.onload = function () {
      const data = new Uint8Array(reader.result);
      const workbook = read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const list = [];

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

      setTestOpition((pre) => ({ ...pre, topicLength: list.length }));
      setTopicList(shuffle(xlxsData.current));
      handleReset();
    };
  };

  return (
    <header className="flex flex-col gap-2 my-10 border p-5 rounded-md sticky top-1 backdrop-blur-sm shadow-lg z-30 container mx-auto">
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
          <Link to="/analyze" className="btn btn-sm btn-active">
            歷史測驗結果
          </Link>
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
    </header>
  );
};

export default InputFileHeader;
