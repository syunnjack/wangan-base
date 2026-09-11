import type { Metadata } from "next";
import Link from "next/link";
import "../ic-card.css";

export const metadata: Metadata = {
  title: "広告・PR方針",
  description: "WANGAN BASE の広告およびアフィリエイトリンクに関する方針。",
  alternates: { canonical: "https://midnightpit.jp/disclosure" },
};

export default function Disclosure() {
  return (
    <main className="ic-page">
      <Link className="ic-back" href="/">← WANGAN BASE へ戻る</Link>
      <h1>広告・PR方針</h1>
      <section>
        <h2>広告収益について</h2>
        <p>本サイトは、アフィリエイト広告から収益を得る場合があります。収益はサーバー費用と運営に充てます。</p>
      </section>
      <section>
        <h2>明確な表示</h2>
        <p>アフィリエイトリンクを含む箇所には「PR」と表示します。リンクには <code>rel=&quot;sponsored&quot;</code> を付けています。報酬の有無によって、記事の内容や評価を変えることはしません。</p>
      </section>
      <section>
        <h2>商品を名指ししない理由</h2>
        <p>運営者が実際に使って確認していない商品を、名前や価格を挙げて薦めることはしません。確認していない数字を書かないという方針は、サイト全体で共通です。そのため商品紹介は、販売サイトの検索結果への入口という形にしています。</p>
      </section>
      <section>
        <h2>購入と契約</h2>
        <p>リンク先での商品購入は各事業者との取引です。価格、在庫、返品、個人情報の取扱いはリンク先でご確認ください。</p>
      </section>
      <p className="ic-disclaimer">制定日：2026年9月12日</p>
    </main>
  );
}
