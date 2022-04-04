import { useRouter } from "next/router";

const Pagination = (props: { totalPage: number }) => {
  const { totalPage } = props;
  const { query, push } = useRouter();
  const page = Number(query.index);

  const hasPrev = page !== 1;
  const hasNext = page !== totalPage;

  return (
    <div className="flex justify-between mx-1 my-2">
      <div
        className={
          hasPrev ? "cursor-pointer" : "opacity-50 pointer-events-none"
        }
        onClick={() => {
          if (hasPrev) {
            push(`/page/${page - 1}`);
          }
        }}
      >
        {"< Prev"}
      </div>
      <div>{`${page} / ${totalPage}`}</div>
      <div
        className={
          hasNext ? "cursor-pointer" : "opacity-50 pointer-events-none"
        }
        onClick={() => {
          if (hasNext) {
            push(`/page/${page + 1}`);
          }
        }}
      >
        {"Next >"}
      </div>
    </div>
  );
};

export default Pagination;
