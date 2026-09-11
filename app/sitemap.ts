import type { MetadataRoute } from "next";

// output: "export" で静的書き出しするため、生成時に固定する。
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: "https://midnightpit.jp/", lastModified, changeFrequency: "weekly", priority: 1 },
    { url: "https://midnightpit.jp/ic-card", lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://midnightpit.jp/disclosure", lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
