import type { Metadata } from "next";
import "./globals.css";
import "./ugc.css";
import "./revenue.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://midnightpit.jp"),
  title: { default: "WANGAN BASE", template: "%s｜WANGAN BASE" },
  description: "湾岸ミッドナイト マキシマムチューンのプレイ記録を、運営者ひとりが書いていく非公式サイト。",
  applicationName: "WANGAN BASE",
  keywords: ["湾岸ミッドナイト マキシマムチューン", "湾岸マキシ 6RR PLUS", "全国分身対戦", "湾岸マキシ 設置店", "アミューズメントICカード"],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://midnightpit.jp/" },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RGNRZEW76D"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-RGNRZEW76D');` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
