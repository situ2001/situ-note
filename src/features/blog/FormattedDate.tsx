import { useEffect, useState } from "react";

interface Props {
  date: string;
}

export default function FormattedDate({ date }: Props) {
  const [localDate, setLocalDate] = useState("");

  useEffect(() => {
    setLocalDate(new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date)));
  }, [date]);

  return <time dateTime={date}>{localDate}</time>;
}
