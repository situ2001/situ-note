import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";

const PaginationBar = (props: any) => {
  const { totalPage } = props;
  const { query, push } = useRouter();
  const page = Number(query.page);

  const hasPrev = page !== 1;
  const hasNext = page !== totalPage;

  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", mx: 1, my: 2 }}
    >
      <Typography
        component="div"
        sx={
          hasPrev
            ? { cursor: "pointer" }
            : { opacity: "0.6", pointerEvents: "none" }
        }
        onClick={() => {
          if (hasPrev) {
            push(`/posts/page/${page - 1}`);
          }
        }}
      >
        {"< Prev"}
      </Typography>
      <Typography component="div">{`${page} / ${totalPage}`}</Typography>
      <Typography
        component="div"
        sx={
          hasNext
            ? { cursor: "pointer" }
            : { opacity: "0.6", pointerEvents: "none" }
        }
        onClick={() => {
          if (hasNext) {
            push(`/posts/page/${page + 1}`);
          }
        }}
      >
        {"Next >"}
      </Typography>
    </Box>
  );
};

export default PaginationBar;
