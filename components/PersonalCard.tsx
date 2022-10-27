const PersonalCard = () => {
  const column = {
    introduction: {
      text: [
        "👨‍🎓 Sophomore",
        "💪 Dream of becoming a front-end or full-stack engineer.",
      ],
    },
  };

  return (
    <div className="flex flex-col w-full mt-32 mb-8">
      <div className="flex justify-between mb-8">
        <div className="flex flex-col justify-center flex-1">
          <p className="text-6xl mb-4 font-extrabold">Hi,</p>
          <p className="text-4xl font-bold">I am situ2001.</p>
        </div>
      </div>
      <div>
        <h1 className="font-bold text-xl mb-2">Intro</h1>
        {column.introduction.text.map((text) => (
          <p key={text} className="mb-2">
            {text}
          </p>
        ))}
      </div>
      <div>Contract button placed here</div>
    </div>
  );
};

export default PersonalCard;
