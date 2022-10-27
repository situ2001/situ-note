import Link from "next/link";
import Image from "next/image";

const column = {
  introduction: {
    text: [
      "👨‍🎓 Sophomore",
      "💪 Dream of becoming a front-end or full-stack engineer.",
    ],
  },
};

const PersonalCard = ({}: any) => {
  const name = "situ2001";
  const avatarLink = "https://avatars.githubusercontent.com/u/28241963";

  return (
    <div className="flex flex-col w-full my-8 max-w-md">
      <div className="flex justify-between mb-8">
        <div className="flex flex-col justify-center flex-1">
          <p className="text-5xl font-extrabold">Hi</p>
          <p className="text-3xl">I am {name}</p>
        </div>
        <div className="ml-4 flex-grow-0 h-36 w-36 flex-shrink-0 relative">
          <Image
            className="rounded-full"
            src={avatarLink}
            layout="fill"
            objectFit="contain"
            alt="avatar"
          />
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
    </div>
  );
};

export default PersonalCard;
