import moment from "moment";
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

  // UTC (But in fact CST) => Real UTC
  const dateObject = new Date(date);
  dateObject.setHours(dateObject.getHours() - 8);
  const realTimeUTC = dateObject.getTime();
  const currentMoment = moment(realTimeUTC);

  // TODO 移动端适配 Box layout
  return (
    <div className="card card-normal w-full bg-base-100 shadow-xl mb-8">
      <div className="card-body">
        <Link href={link}>
          <a className="card-title">{title}</a>
        </Link>
        <div>{description}</div>
        <div className="card-actions justify-between">
          <div>
            <div>{currentMoment.format("ll")}</div>
            <div className="badge">
              <div>{categories}</div>
            </div>
          </div>
          <Link href={link}>
            <a className="btn btn-primary">阅读</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostInfoCard;
