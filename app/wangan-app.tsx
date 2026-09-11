"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

// このサイトは運営者ひとりのプレイ記録。
// 以前は架空の投稿・投票数・オンライン人数・貢献ランキングを初期値として
// 持っていたが、実在しない利用者を装うことになるため全て削除した。
// ここに置いてよいのは、公式が公表している情報と、運営者自身の記録だけ。

type Garage = { rank: string; car: string; story: number; course: string };

const emptyGarage: Garage = { rank: "", car: "", story: 0, course: "C1" };

// 運営者が登録している車。ランクとチューニングは車両データごとに別で持つため、
// どの記録がどの車のものかを必ず添える。1枚のカードの中で別々の段階が同時に成立する。
// 未確認のものは空欄にして「未確認」と出す。埋めたくなったら先に筐体で確かめること。
const ownerGarage = [
  {
    slot: "01",
    maker: "NISSAN",
    name: "SKYLINE GT-R",
    code: "BNR32",
    obtained: "最初に登録した1台",
    playing: "ストーリーモード",
    title: "連装キング",
    rank: "C5級",
    power: "720馬力",
    distance: "1,023km",
    updated: "2026年9月3日",
    note: "",
  },
  {
    slot: "02",
    maker: "MITSUBISHI",
    name: "LANCER Evolution III GSR",
    code: "CE9A",
    obtained: "廃車カードで作成",
    playing: "ビンゴと全国分身",
    title: "",
    rank: "C6級",
    power: "600馬力/B",
    distance: "",
    updated: "2026年9月11日",
    note: "名古屋を走っている。全国分身の撃破トロフィーは140個。",
  },
  {
    slot: "03",
    maker: "SUBARU",
    name: "R2",
    code: "RC2",
    obtained: "ターミナルスクラッチ",
    playing: "未着手",
    title: "",
    rank: "",
    power: "",
    distance: "",
    updated: "",
    note: "車種は運営者の記憶によるもので、筐体でまだ確かめていない。緑の軽自動車という以外は未確認。",
  },
];

// 収録コースと車種。名称は実在するもの。備考は運営者の私見であることを明示する。
// 走った日の記録。称号や距離のような数字ではなく、その日にあったこと。
// statusLog（称号・馬力・距離）とは別に持つ。数字が動かない日でも
// 書けることがあるため。新しい順に積み、上書きしない。
const playLog = [
  {
    updated: "2026年9月11日",
    headline: "エボ3で全国分身を続けている",
    body: [
      "エボ3の撃破トロフィーが110個から140個になった。",
      "1プレイあたりの撃破数は平均1.5台ほどで、目の前の3番手は抜けても、ポールの車まで届いていない。",
      "走っているのは名古屋。R32とは別の車なので、称号も馬力も別に積み上がっていく。",
    ],
  },
  {
    updated: "2026年9月5日",
    headline: "全国分身という遊び方を知った",
    body: [
      "全国分身という遊び方を知った。きょうは4勝5敗。",
      "対戦相手のレベルも選べるので、しばらく続けるつもり。",
      "ゲームセンターに行くたびに、スクラッチとビンゴをやっている。",
    ],
  },
];

const courses = [
  { name: "C1", sub: "内回り / 外回り", note: "最初に走り込んでいるコース", color: "cyan" },
  { name: "湾岸線", sub: "東行き / 西行き", note: "高速域の車線変更が課題", color: "amber" },
  { name: "大阪", sub: "阪神高速環状", note: "未着手", color: "violet" },
  { name: "神戸", sub: "阪神高速3号", note: "未着手", color: "rose" },
];

const cars = [
  ["01", "NISSAN", "SKYLINE GT-R", "BNR32"],
  ["02", "MAZDA", "RX-8", "SE3P"],
  ["03", "MITSUBISHI", "LANCER Evolution IX", "CT9A"],
  ["04", "NISSAN", "SKYLINE GT-R", "BNR34"],
];

type ArcadeArea = { region: string; prefecture: string; area: string };

const arcadeAreas: ArcadeArea[] = [
  ["北海道・東北","北海道","JP-01"],["北海道・東北","青森県","JP-02"],["北海道・東北","岩手県","JP-03"],["北海道・東北","宮城県","JP-04"],["北海道・東北","秋田県","JP-05"],["北海道・東北","山形県","JP-06"],["北海道・東北","福島県","JP-07"],
  ["関東","茨城県","JP-08"],["関東","栃木県","JP-09"],["関東","群馬県","JP-10"],["関東","埼玉県","JP-11"],["関東","千葉県","JP-12"],["関東","東京都（23区）","JP-13&sw=1"],["関東","東京都（23区外）","JP-13&sw=0"],["関東","神奈川県","JP-14"],
  ["信越・北陸","新潟県","JP-15"],["信越・北陸","富山県","JP-16"],["信越・北陸","石川県","JP-17"],["信越・北陸","福井県","JP-18"],["信越・北陸","山梨県","JP-19"],["信越・北陸","長野県","JP-20"],
  ["東海","岐阜県","JP-21"],["東海","静岡県","JP-22"],["東海","愛知県","JP-23"],["東海","三重県","JP-24"],
  ["関西","滋賀県","JP-25"],["関西","京都府","JP-26"],["関西","大阪府","JP-27"],["関西","兵庫県","JP-28"],["関西","奈良県","JP-29"],["関西","和歌山県","JP-30"],
  ["中国・四国","鳥取県","JP-31"],["中国・四国","島根県","JP-32"],["中国・四国","岡山県","JP-33"],["中国・四国","広島県","JP-34"],["中国・四国","山口県","JP-35"],["中国・四国","徳島県","JP-36"],["中国・四国","香川県","JP-37"],["中国・四国","愛媛県","JP-38"],["中国・四国","高知県","JP-39"],
  ["九州・沖縄","福岡県","JP-40"],["九州・沖縄","佐賀県","JP-41"],["九州・沖縄","長崎県","JP-42"],["九州・沖縄","熊本県","JP-43"],["九州・沖縄","大分県","JP-44"],["九州・沖縄","宮崎県","JP-45"],["九州・沖縄","鹿児島県","JP-46"],["九州・沖縄","沖縄県","JP-47"],
].map(([region, prefecture, area]) => ({ region, prefecture, area }));

const arcadeRegions = [...new Set(arcadeAreas.map(({ region }) => region))];
const officialLocationUrl = (area: string) =>
  `https://wanganmaxi-official.com/wanganmaxi6rrplus/jp/locations/list?area=${area}`;

export default function WanganApp() {
  const [garage, setGarage] = useState(emptyGarage);
  const [active, setActive] = useState("ホーム");
  const [modal, setModal] = useState<"garage" | null>(null);
  const [arcadeQuery, setArcadeQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("wangan-base.garage");
      if (saved) setGarage(JSON.parse(saved));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredArcadeAreas = useMemo(() => arcadeAreas.filter(({ region, prefecture }) => `${region} ${prefecture}`.toLowerCase().includes(arcadeQuery.toLowerCase())), [arcadeQuery]);

  const jump = (label: string, id: string) => {
    setActive(label);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const saveGarage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = { rank: String(data.get("rank")), car: String(data.get("car")), story: Number(data.get("story")), course: String(data.get("course")) };
    setGarage(next); localStorage.setItem("wangan-base.garage", JSON.stringify(next)); setModal(null);
  };

  const hasRecord = Boolean(garage.rank || garage.car || garage.story);

  return (
    <main>
      <header className="site-header">
        <button className="brand" onClick={() => jump("ホーム", "top")} aria-label="WANGAN BASE ホーム">
          <span className="brand-mark"><i /></span><span>WANGAN <b>BASE</b><small>PLAY RECORD</small></span>
        </button>
        <nav aria-label="メインメニュー">
          {[["ホーム","top"],["記録","record"],["日記","log"],["コース","guides"],["車種","cars"],["店舗","arcades"]].map(([label,id]) => <button className={active === label ? "active" : ""} onClick={() => jump(label,id)} key={label}>{label}</button>)}
        </nav>
        <button className="garage-button" onClick={() => setModal("garage")}><span>◉</span> 自分のメモ</button>
      </header>

      <section className="hero" id="top">
        <div className="road-lines" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span>●</span> ONE PLAYER RECORD</p>
          <h1>走った分だけ、<br/><em>書いていく。</em></h1>
          <p className="hero-lead">湾岸ミッドナイト マキシマムチューン 6RR PLUS を遊んだ記録を、運営者ひとりが書いていくサイトです。<br/>攻略の断定はしません。分かっていないことは、分かっていないと書きます。</p>
          <div className="hero-actions"><button className="primary" onClick={() => jump("記録","record")}>いまの状況を見る <span>→</span></button><button className="secondary" onClick={() => jump("店舗","arcades")}>設置店を探す</button></div>
        </div>
      </section>

      <section className="section" id="record">
        <div className="section-title"><div><p className="kicker">GARAGE</p><h2>いまの状況</h2></div><p>運営者本人の進捗です。<br/>車ごとに分けて書いています。</p></div>
        <div className="arcade-notice"><span>RECORD</span><p>同じカードに3台を登録して遊んでいます。ランクとチューニングは車両データごとに別で持つため、下の記録も車ごとに分けています。1台の数字を全体の進捗と読み違えないようにするためです。</p></div>
        <div className="garage-grid">{ownerGarage.map((car) => <article className="garage-card" key={car.slot}>
          <header><span className="garage-slot">{car.slot}</span><div><small>{car.maker}</small><h3>{car.name}</h3><em>{car.code}</em></div></header>
          <dl>
            <div><dt>入手</dt><dd>{car.obtained}</dd></div>
            <div><dt>遊び方</dt><dd>{car.playing}</dd></div>
            <div><dt>称号</dt><dd>{car.title || "未記録"}</dd></div>
            <div><dt>ランク</dt><dd>{car.rank || "未確認"}</dd></div>
            <div><dt>馬力</dt><dd>{car.power || "未確認"}</dd></div>
            <div><dt>累計走行距離</dt><dd>{car.distance || "未記録"}</dd></div>
          </dl>
          {car.note && <p className="garage-note">{car.note}</p>}
          <footer>{car.updated ? `${car.updated}時点` : "まだ走っていない"}</footer>
        </article>)}</div>
        <p className="arcade-disclaimer">以前このページには、架空のドライバー名、ストーリー進捗、オンライン人数、投稿、投票数、貢献ランキングを初期表示として置いていました。実在しない利用者を装うことになるため、2026年9月2日にすべて削除しました。</p>
      </section>

      <section className="section" id="log">
        <div className="section-title"><div><p className="kicker">PLAY LOG</p><h2>走った日の記録</h2></div><p>その日にあったことを書いています。<br/>称号や距離は「いまの状況」にあります。</p></div>
        <div className="play-log">{playLog.map((entry) => <article key={entry.updated}><span className="play-log-date">{entry.updated}</span><h3>{entry.headline}</h3>{entry.body.map((line, i) => <p key={i}>{line}</p>)}</article>)}</div>
      </section>

      <section className="section" id="guides">
        <div className="section-title"><div><p className="kicker">COURSE</p><h2>収録コース</h2></div><p>ゲームに収録されているコースです。<br/>備考は運営者が走った範囲の私見です。</p></div>
        <div className="course-grid">{courses.map((course, index) => <article className={`course-card ${course.color}`} key={course.name}><div className="course-number">0{index+1}</div><div className="course-route"><i/><i/><i/></div><p>COURSE</p><h3>{course.name}</h3><span>{course.sub}</span><dl><div><dt>運営者のメモ</dt><dd>{course.note}</dd></div></dl></article>)}</div>
      </section>

      <section className="section dark-panel" id="cars">
        <div className="section-title"><div><p className="kicker">MACHINE</p><h2>車種</h2></div><p>名称のみを載せています。<br/>性能の比較はしていません。</p></div>
        <div className="car-list">{cars.map((car) => <article key={car[0]}><span className="car-no">{car[0]}</span><div className="car-icon">◇</div><div className="car-name"><small>{car[1]}</small><h3>{car[2]}</h3><span>{car[3]}</span></div></article>)}</div>
      </section>

      <section className="section arcade-section" id="arcades">
        <div className="section-title">
          <div><p className="kicker">ARCADE DIRECTORY</p><h2>全国の設置店を、<br/><em>探す。</em></h2></div>
          <p>湾岸ミッドナイト マキシマムチューン 6RR PLUS<br/>公式設置店舗情報へのリンク集です。</p>
        </div>
        <div className="arcade-notice"><span>OFFICIAL</span><p>店舗名・住所・設置台数は、このサイトでは持っていません。各都道府県のリンクから、公式の最新一覧をそのまま開きます。</p></div>
        <label className="arcade-search">⌕<input value={arcadeQuery} onChange={event => setArcadeQuery(event.target.value)} placeholder="都道府県・地方名で検索" /></label>
        <div className="arcade-regions">
          {arcadeRegions.map(region => {
            const areas = filteredArcadeAreas.filter(area => area.region === region);
            if (!areas.length) return null;
            return <article className="arcade-region" key={region}><header><span>{String(arcadeRegions.indexOf(region) + 1).padStart(2, "0")}</span><h3>{region}</h3></header><div>{areas.map(area => <a href={officialLocationUrl(area.area)} target="_blank" rel="noreferrer" key={area.prefecture}><b>{area.prefecture}</b><span>公式設置店を見る ↗</span></a>)}</div></article>;
          })}
        </div>
        <p className="arcade-disclaimer">リンク先は公式サイトです。未掲載・撤去済みの場合もあるため、来店前に各店舗へ直接ご確認ください。情報提供元：バンダイナムコエクスペリエンス公式サイト。</p>
      </section>

      <footer className="footer"><div className="brand"><span className="brand-mark"><i /></span><span>WANGAN <b>BASE</b></span></div><p>運営者ひとりのプレイ記録サイトです。掲示板や会員制度はありません。<br/>ファンによる非公式サイトで、ゲームメーカーおよび権利者各社とは関係ありません。ゲーム名、車名、商標等は各権利者に帰属します。</p><div><a href="#record">いまの状況</a><a href="#log">走った日の記録</a><a href="#guides">コース</a><a href="#arcades">設置店</a><a href="/ic-card">ICカード</a><a href="/disclosure">広告・PR方針</a><a href="#top">サイトについて</a></div></footer>

      <nav className="mobile-nav">{[["⌂","ホーム","top"],["◎","記録","record"],["⌁","コース","guides"],["♢","メモ","garage"]].map(([icon,label,id]) => <button onClick={() => id === "garage" ? setModal("garage") : jump(label,id)} key={label}><b>{icon}</b>{label}</button>)}</nav>

      {modal && <div className="modal-backdrop" role="presentation" onMouseDown={() => setModal(null)}><section className="modal" role="dialog" aria-modal="true" aria-label="自分のメモ" onMouseDown={e => e.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)}>×</button><p className="kicker">MY MEMO</p><h2>自分の進捗をメモする</h2><p className="post-prompt">このメモはお使いの端末にだけ保存されます。運営者にも他の人にも送信されません。{hasRecord ? "" : " まだ何も保存されていません。"}</p><form onSubmit={saveGarage}><div className="form-row"><label>ランク<input name="rank" defaultValue={garage.rank} placeholder="例：C8" /></label><label>ストーリー話数<input name="story" type="number" min="0" max="100" defaultValue={garage.story} /></label></div><label>使用車種<input name="car" defaultValue={garage.car} placeholder="例：SKYLINE GT-R (BNR32)" /></label><label>練習中のコース<select name="course" defaultValue={garage.course}>{courses.map(c=><option key={c.name}>{c.name}</option>)}</select></label><button className="primary">保存する →</button></form></section></div>}
    </main>
  );
}
