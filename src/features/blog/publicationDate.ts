const BLOGGER_TIMEZONE_OFFSET = "+08:00";

/** Interpret timezone-free frontmatter as the blogger's local publication time. */
export function parsePublicationDate(value: string | Date): Date {
  // Astro's YAML parser turns unquoted dates into UTC Date objects. Their UTC
  // clock fields still represent the timezone-free time written in frontmatter.
  if (value instanceof Date) {
    return new Date(value.getTime() - 8 * 60 * 60 * 1000);
  }
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const localDateTime = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(value);
  const withTimezone = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value);

  if (!dateOnly && !localDateTime && !withTimezone) {
    throw new Error(`Invalid publication date: ${value}`);
  }

  const normalized = dateOnly
    ? `${value}T00:00:00${BLOGGER_TIMEZONE_OFFSET}`
    : localDateTime
      ? `${value.replace(" ", "T")}${BLOGGER_TIMEZONE_OFFSET}`
      : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid publication date: ${value}`);
  }
  return date;
}
