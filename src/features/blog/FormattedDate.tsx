import React from "react";
import { formatPublicationDate } from "./publicationDate";

interface Props {
  date: string;
}

export default function FormattedDate({ date }: Props) {
  return <time dateTime={date}>{formatPublicationDate(new Date(date))}</time>;
}
