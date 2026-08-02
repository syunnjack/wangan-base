import type { Metadata } from "next";
import WanganApp from "./wangan-app";

const title = "WANGAN BASE｜湾岸プレイヤーの攻略基地";
const description = "攻略を調べる、成長を記録する、仲間とつながる。湾岸プレイヤーのための非公式コミュニティサイト。";

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
