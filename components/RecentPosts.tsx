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
          <a className="ml-auto opacity-60">More...</a>
        </Link>
      </div>
      {recentPost.map((post) => (
        <div className="mt-4" key={post.id}>
          <Link key={post.id} href={`/posts/${post.filename}`}>
            <a>{post.title}</a>
          </Link>
          <div className="opacity-60">
            {moment(post.date).format("YYYY-MM-DD")}
          </div>
        </div>
      ))}
    </div>
  );
}
