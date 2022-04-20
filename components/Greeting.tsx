import Link from "next/link";
import { IconList } from "../types/PersonalCard";

/* eslint-disable @next/next/no-img-element */
const Greeting = ({
  name,
  avatarLink,
  iconList,
}: {
  name: string;
  avatarLink: string;
  iconList: IconList;
}) => {
  return (
    <div className="flex max-h-36 justify-between mb-8">
      <div className="flex flex-col justify-end flex-1">
        <p className="text-4xl font-extrabold w-full">Hi</p>
        <p className="text-2xl w-full">I am {name}</p>
        <p className="mt-2 opacity-50 text-xs">
          You may be interested in my...
        </p>
        <div className="mt-2 flex">
          {iconList.map((obj, i) => (
            <>
              <Link key={i} href={obj.href}>
                {obj.element}
              </Link>
              <div className="mx-1"></div>
            </>
          ))}
        </div>
      </div>
      <div className="ml-4 flex-grow-0 max-w-full h-36">
        <img
          className="rounded-full object-cover h-full max-w-full"
          src={avatarLink}
          alt="avatar"
        />
      </div>
    </div>
  );
};

export default Greeting;
