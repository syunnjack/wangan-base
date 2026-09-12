import type { Metadata } from "next";
import WanganApp from "./wangan-app";

const title = "WANGAN BASE｜湾岸ミッドナイト マキシマムチューンのプレイ記録";
const description = "湾岸ミッドナイト マキシマムチューン 6RR PLUS を遊んだ記録を、運営者ひとりが書いていく非公式サイト。同じカードに3台を登録しています。R32 GT-Rは称号「連装キング」でC5級720馬力、エボ3はC4級600馬力で名古屋のビンゴと全国分身、もう1台はスクラッチで引いた軽自動車のR2。全国の公式設置店一覧へのリンクも置いています。";

export const metadata: Metadata = {
  metadataBase: new URL("https://midnightpit.jp"),
  title,
  description,
  openGraph: { title, description, url: "https://midnightpit.jp", images: [{ url: "/og.png", width: 1536, height: 1024 }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export default function Home() {
  return <WanganApp />;
}
