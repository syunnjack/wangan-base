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
    <html lang="ja"><head><script async src="https://www.googletagmanager.com/gtag/js?id=G-RGNRZEW76D"></script><script dangerouslySetInnerHTML={{__html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-RGNRZEW76D');`}} /></head>
      <body>{children}</body>
    </html>
  );
}
