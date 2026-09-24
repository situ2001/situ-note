import { renderToString } from "solid-js/web";
import { expect, test } from "vitest";
import FormattedDate from "../src/features/blog/FormattedDate";

test("renders the publication date in UTC+8 on the server", () => {
  const previousTimezone = process.env.TZ;
  try {
    process.env.TZ = "America/New_York";
    const html = renderToString(() => FormattedDate({ date: "2024-12-31T17:00:00.000Z" }));

    expect(html).toContain(">Jan 1, 2025</time>");
  } finally {
    if (previousTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimezone;
  }
});
