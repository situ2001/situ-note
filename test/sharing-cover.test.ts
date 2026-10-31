import { expect, test } from "vitest";
import sharp from "sharp";
import { renderSharingCover } from "../src/features/blog/sharingCover";

test.each([
  {
    title: "西数 HA340 硬盘在 QNAP NAS 上频繁启停的问题排查与解决方法",
    description: "西数 HA340 硬盘在 QNAP NAS 上频繁启停的问题，经过排查发现是硬盘的 APM 值变为 0 导致的，可以通过 hdparm 命令进行设置这个值以进行规避",
  },
  { title: "λ在Java", description: "Lambda在Java" },
])("generates a static sharing cover for $title", async ({ title, description }) => {
  const image = await renderSharingCover({
    title,
    description,
  });

  expect(await sharp(image).metadata()).toMatchObject({
    format: "png",
    width: 1200,
    height: 630,
  });
});
