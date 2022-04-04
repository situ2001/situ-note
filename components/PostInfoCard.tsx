import Link from "next/link";

type PostInfo = {
  title: string;
  date: string;
  description: string;
  categories: string;
  link: string;
};

const PostInfoCard = (props: PostInfo) => {
  const { title, date, description, categories, link } = props;

  const dateObject = new Date(date);
  const y = dateObject.getFullYear();
  const m = dateObject.getMonth() + 1;
  const d = dateObject.getDate();

  // TODO 移动端适配 Box layout
  return (
    <div className="card card-normal w-full bg-base-100 shadow-xl mb-8">
      <div className="card-body">
        <Link href={link} passHref>
          <div className="card-title cursor-pointer">{title}</div>
        </Link>
        <div>{description}</div>
        <div className="card-actions justify-between">
          <div>
            <div>{`${y}年${m}月${d}日`}</div>
            <div className="badge">
              <div>{categories}</div>
            </div>
          </div>
          <Link href={link} passHref>
            <button className="btn btn-primary">阅读</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostInfoCard;
