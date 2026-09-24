const BLOGGER_TIMEZONE_OFFSET = "+08:00";
const publicationDateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: BLOGGER_TIMEZONE_OFFSET,
});
const publicationYearFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  timeZone: BLOGGER_TIMEZONE_OFFSET,
});

export function formatPublicationDate(date: Date): string {
  return publicationDateFormatter.format(date);
}

export function publicationYear(date: Date): number {
  return Number(publicationYearFormatter.format(date));
}

/** Parse a publication instant whose source declares its timezone explicitly. */
export function parsePublicationDate(value: string): Date {
  const withTimezone = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value);
  if (!withTimezone) {
    throw new Error(`Invalid publication date: ${value}`);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid publication date: ${value}`);
  }
  return date;
}
