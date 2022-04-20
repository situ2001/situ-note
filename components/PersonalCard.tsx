import Greeting from "./Greeting";
import {
  FiPenTool,
  FiGithub,
  FiStar,
  FiGitPullRequest,
  FiGitMerge,
  FiHelpCircle,
} from "react-icons/fi";
import { IconList } from "../types/PersonalCard";

const iconList: IconList = [
  {
    element: (
      <div className="tooltip tooltip-bottom" data-tip="Blog">
        <FiPenTool className="cursor-pointer" size={20} />
      </div>
    ),
    href: "/page",
  },
  {
    element: (
      <div className="tooltip tooltip-bottom" data-tip="GitHub">
        <FiGithub className="cursor-pointer" size={20} />
      </div>
    ),
    href: "https://github.com/situ2001",
  },
];

const column = {
  introduction: {
    text: [
      "👨‍🎓 Sophomore",
      "💪 Dream of becoming a front-end or full-stack engineer.",
    ],
  },
};

const PersonalCard = ({ githubStat }: any) => {
  const { stars, prs, issues, contributeTo } = githubStat;

  return (
    <div className="flex flex-col w-full max-w-md my-8">
      <Greeting
        name="situ2001"
        avatarLink="https://avatars.githubusercontent.com/u/28241963"
        iconList={iconList}
      />
      <div>
        <h1 className="font-bold text-xl mb-2">Intro</h1>
        {column.introduction.text.map((text) => (
          <p key={text} className="mb-2">
            {text}
          </p>
        ))}
      </div>
      <div>
        <h1 className="font-bold text-xl mb-2">State</h1>
        <div className="github-stat mb-2 flex justify-between">
          <div className="flex items-center mr-2">
            <FiStar size={20} />
            <p className="ml-2 font-bold">{stars}</p>
          </div>
          <div className="flex items-center mr-2">
            <FiGitPullRequest size={20} />
            <p className="ml-2 font-bold">{prs}</p>
          </div>
          <div className="flex items-center mr-2">
            <FiGitMerge size={20} />
            <p className="ml-2 font-bold">{contributeTo}</p>
          </div>
          <div className="flex items-center mr-2">
            <FiHelpCircle size={20} />
            <p className="ml-2 font-bold">{issues}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalCard;
