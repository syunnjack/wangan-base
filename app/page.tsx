import type { Metadata } from "next";
import { headers } from "next/headers";
import WanganApp from "./wangan-app";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "WANGAN BASE｜湾岸プレイヤーの攻略基地";
  const description = "攻略を調べる、成長を記録する、仲間とつながる。湾岸プレイヤーのための非公式コミュニティサイト。";
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: `${origin}/og.png`, width: 1536, height: 1024 }] },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
  };
}

export default function Home() {
  return <WanganApp />;
}
