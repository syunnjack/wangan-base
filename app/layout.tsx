import type { Metadata } from "next";
import "./globals.css";
import "./ugc.css";
import "./revenue.css";

export const metadata: Metadata = {
  title: { default: "WANGAN BASE", template: "%s｜WANGAN BASE" },
  description: "走るほど、つながる。湾岸プレイヤーの攻略基地。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
