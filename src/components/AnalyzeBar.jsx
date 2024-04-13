const AnalyzeBar = ({ topicList, testOpition, showAnswer, analyzeTabData }) => {
  return (
    <div className="stats shadow backdrop-blur-sm bg-transparent">
      <div className="stat">
        <div className="stat-figure text-secondary"></div>
        <div className="stat-title">答對題數</div>
        <div className="stat-value"> </div>
        {!topicList?.length ? (
          <small className="my-auto mx-auto font-bold">未讀取檔案</small>
        ) : showAnswer ? (
          <div className="stat-value">
            {analyzeTabData?.passQuantity} / {testOpition?.topicLength}
          </div>
        ) : (
          <small className="my-auto mx-auto font-bold">未作答完成</small>
        )}
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary"></div>
        <div className="stat-title">百分比</div>

        {!topicList?.length ? (
          <small className="my-auto mx-auto font-bold">未讀取檔案</small>
        ) : showAnswer ? (
          <div className="stat-value">
            <p
              className={`${
                analyzeTabData?.notice ? "text-success" : "text-error"
              }`}
            >
              {analyzeTabData.passPercentage}%
            </p>
          </div>
        ) : (
          <small className="my-auto mx-auto font-bold">未作答完成</small>
        )}
        {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary"></div>
        <div className="stat-title">評比(是否高於90%)</div>
        {!topicList?.length ? (
          <small className="my-auto mx-auto font-bold">未讀取檔案</small>
        ) : showAnswer ? (
          <div className="stat-value">
            {analyzeTabData?.notice ? (
              <small className="text-success">通過</small>
            ) : (
              <small className="text-error">重測</small>
            )}
          </div>
        ) : (
          <small className="my-auto mx-auto font-bold">未作答完成</small>
        )}
      </div>
      {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
    </div>
  );
};

export default AnalyzeBar;
