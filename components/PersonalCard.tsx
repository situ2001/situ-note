import Link from "next/link";
import { FiGithub, FiPenTool } from "react-icons/fi";

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
      <div className="mb-4">
        {column.introduction.text.map((text) => (
          <p key={text} className="mb-2">
            {text}
          </p>
        ))}
      </div>
      <div>
        <Link href={"https://github.com/situ2001"}>
          <button
            className="btn btn-outline btn-sm gap-1 rounded mr-2"
            onClick={() => {
              console.log("Visit mt GitHub");
            }}
          >
            <FiGithub />
            GitHub
          </button>
        </Link>
        <Link href={"/page/1"}>
          <button
            className="btn btn-outline btn-sm gap-1 rounded mr-2"
            onClick={() => {
              console.log("Visit my blog");
            }}
          >
            <FiPenTool />
            Blog
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PersonalCard;
