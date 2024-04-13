export const TopicItem = ({
  item,
  index,
  showAnswer,
  userAnswer,
  register,
}) => {
  const ENG_OPITIONS = ["A", "B", "C", "D", "E"];
  const OX_OPITIONS = ["O", "X"];
  return (
    <li key={index} className="flex rounded-md border overflow-hidden">
      {/* Ans. box */}
      <div className="border-r p-2">
        {item?.answer?.length > 1 ? (
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
            {item?.answer?.toLocaleLowerCase() !== "o" &&
            item?.answer?.toLocaleLowerCase() !== "x"
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
            userAnswer?.[item?.id]?.toLocaleLowerCase() === item?.answer
              ? "bg-success"
              : "bg-error"
          }  max-w-[56px] flex flex-1 justify-center items-center ml-auto text-white font-bold`}
        >
          {item?.answer?.toUpperCase()}
        </div>
      )}
    </li>
  );
};

const TopicList = ({
  topicList,
  testOpition,
  showAnswer,
  userAnswer,
  register,
  children,
}) => {
  // Bug: one Chinese length to input not select
  return (
    <ul className="flex flex-col gap-2 p-2">
      {topicList.slice(0, testOpition.topicLength).map((item, index) => (
        <TopicItem
          item={item}
          index={index}
          showAnswer={showAnswer}
          userAnswer={userAnswer}
          register={register}
        />
      ))}
    </ul>
  );
};

export default TopicList;
