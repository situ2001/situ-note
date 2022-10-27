import { Post } from "@prisma/client";
import moment from "moment";
import Link from "next/link";

interface Props {
  recentPost: Post[];
}

export default function RecentPosts(props: Props) {
  const { recentPost } = props;

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline">
        <div className="text-2xl">Recent Posts</div>
        <Link href={"/page/1"}>
          <div className="ml-auto opacity-60 cursor-pointer">More...</div>
        </Link>
      </div>
      {recentPost.map((post) => (
        <Link key={post.id} href={`/posts/${post.filename}`}>
          <div className="mt-4 cursor-pointer" key={post.id}>
            <div>{post.title}</div>
            <div className="opacity-60">
              {moment(post.date).format("YYYY-MM-DD")}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
