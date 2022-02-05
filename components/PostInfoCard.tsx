import { Box, Card, Typography } from "@mui/material";
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

  return (
    <Card sx={{ my: 2, mx: 1 }}>
      <Box sx={{ m: 2 }}>
        <Link href={link} passHref>
          <Typography sx={{ cursor: "pointer" }} variant="h5">
            {title}
          </Typography>
        </Link>
        <Typography>{`${y}年${m}月${d}日`}</Typography>
        <Typography>{description}</Typography>
        <Typography>{categories}</Typography>
      </Box>
    </Card>
  );
};

export default PostInfoCard;
