import { useState } from "react";
import { useForm } from "react-hook-form";

import InputFileHeader from "../components/InputFileHeader";
import TopicList from "../components/TopicList";

const Home = () => {
  //defined confing
  const LIMIT_PASS_PERCENTAGE = 90;

  const [testOpition, setTestOpition] = useState({
    fileName: "",
    topicLength: "",
  });
  //
  const [showAnswer, setShowAnswer] = useState(false);
  const [topicList, setTopicList] = useState([]);
  const [userAnswer, setUserAnswer] = useState();
  const [failItems, setFailItems] = useState([]);

  const [analyzeTabData, setAnalyzeTabData] = useState({
    passQuantity: 0,
    passPercentage: 0,
    notice: false,
  });

  //hook-from
  const {
    register,
    handleSubmit,
    watch,
    reset,
    // formState: { errors },
  } = useForm();

  //local
  const localData = JSON.parse(localStorage.getItem("randomXLXS"));

  //answer.
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

    //錯誤題目
    const failItems = topicList
      .slice(0, testOpition?.topicLength)
      .filter(
        (item) =>
          item?.answer?.toLocaleLowerCase() !==
          data?.[item?.id]?.toLocaleLowerCase()
      )
      .map((it, index) => ({ ...it, index }));

    console.log("failItems", failItems);
    setFailItems(failItems);

    const passLength = testOpition?.topicLength - failItems?.length;

    const passPercentage = (
      (passLength / testOpition?.topicLength) *
      100
    ).toFixed(2);

    setAnalyzeTabData((pre) => ({
      ...pre,
      passQuantity: passLength,
      passPercentage: passPercentage,
      notice: passPercentage > LIMIT_PASS_PERCENTAGE,
    }));

    //顯示對答案模式
    setShowAnswer(true);

    //

    if (localData?.[testOpition?.fileName]) {
      localData?.[`${testOpition?.fileName}`].push({
        id: new Date(),
        timeAt: Date.now(),
        passPercentage,
        length: testOpition?.topicLength,
        failItems,
      });

      console.log("pre in", localData);

      localStorage.setItem("randomXLXS", JSON.stringify(localData));
    } else {
      localStorage.setItem(
        "randomXLXS",
        JSON.stringify({
          ...localData,
          [`${testOpition?.fileName}`]: [
            {
              id: new Date(),
              timeAt: Date.now(),
              passPercentage,
              length: testOpition?.topicLength,
              failItems,
            },
          ],
        })
      );
    }
  };

  return (
    <>
      <InputFileHeader
        watch={watch}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
        testOpition={testOpition}
        setTestOpition={setTestOpition}
        topicList={topicList}
        setTopicList={setTopicList}
        analyzeTabData={analyzeTabData}
        failItems={failItems}
        reset={reset}
      />
      <main className="container mx-auto">
        {JSON.stringify()}
        <section>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <TopicList
              showAnswer={showAnswer}
              userAnswer={userAnswer}
              topicList={topicList}
              testOpition={testOpition}
              register={register}
            />
            <button
              className="btn btn-success btn-primary font-bold text-white ml-auto"
              type="submit"
            >
              對答案
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default Home;
