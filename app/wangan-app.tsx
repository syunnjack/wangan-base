"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Garage = { name: string; rank: string; car: string; story: number; course: string };
type Post = { id: number; category: string; title: string; body: string; author: string; tags: string[]; likes: number; time: string };

const defaultGarage: Garage = { name: "NIGHT★RUNNER", rank: "C8", car: "SKYLINE GT-R (BNR32)", story: 32, course: "C1" };
const initialPosts: Post[] = [
  { id: 1, category: "質問・相談", title: "大阪のセッティングは何馬力がおすすめ？", body: "ストーリーを進めながら大阪を練習中です。壁に当たりにくい設定を知りたいです。", author: "C8 / R32", tags: ["大阪", "初心者"], likes: 24, time: "12分前" },
  { id: 2, category: "攻略情報", title: "C1内回り、赤コーナーで失速しない進入", body: "ひとつ手前から外へ寄せ、短いアクセルオフで姿勢を作ると出口が安定します。", author: "B3 / RX-8", tags: ["C1", "ライン取り"], likes: 61, time: "38分前" },
  { id: 3, category: "対戦募集", title: "今週末、初心者同士で走りませんか？", body: "勝敗より練習重視。フルチューン前でも歓迎です。", author: "C5 / EVO IX", tags: ["対戦募集", "初心者歓迎"], likes: 18, time: "1時間前" },
];

const courses = [
  { name: "C1", sub: "内回り / 外回り", level: "TECHNICAL", tune: "700–760 HP", note: "基本が詰まった最初の練習コース", color: "cyan" },
  { name: "湾岸線", sub: "東行き / 西行き", level: "HIGH SPEED", tune: "800–840 HP", note: "高速域の車線変更と一般車回避", color: "amber" },
  { name: "大阪", sub: "阪神高速環状", level: "BALANCED", tune: "740–800 HP", note: "ライン取りと出口速度を磨く", color: "violet" },
  { name: "神戸", sub: "阪神高速3号", level: "BRAKING", tune: "680–740 HP", note: "赤コーナーの減速を覚える", color: "rose" },
];

const cars = [
  ["01", "NISSAN", "SKYLINE GT-R", "BNR32", "安定感", "★★★★★"],
  ["02", "MAZDA", "RX-8", "SE3P", "旋回性", "★★★★★"],
  ["03", "MITSUBISHI", "LANCER Evolution IX", "CT9A", "バランス", "★★★★☆"],
  ["04", "NISSAN", "SKYLINE GT-R", "BNR34", "接触耐性", "★★★★☆"],
];

function targetFor(story: number) {
  if (story < 20) return { next: 20, hp: 600, label: "基本チューン完成" };
  if (story < 50) return { next: 50, hp: 800, label: "800馬力へ" };
  if (story < 80) return { next: 80, hp: 840, label: "フルチューンへ" };
  return { next: 100, hp: 840, label: "ストーリー完走へ" };
}

export default function WanganApp() {
  const [garage, setGarage] = useState(defaultGarage);
  const [posts, setPosts] = useState(initialPosts);
  const [active, setActive] = useState("ホーム");
  const [postFilter, setPostFilter] = useState("すべて");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<"garage" | "post" | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedGarage = localStorage.getItem("wangan-base.garage");
      const savedPosts = localStorage.getItem("wangan-base.posts");
      if (savedGarage) setGarage(JSON.parse(savedGarage));
      if (savedPosts) setPosts(JSON.parse(savedPosts));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const target = targetFor(garage.story);
  const progress = Math.min(100, Math.round((garage.story / target.next) * 100));
  const filteredPosts = useMemo(() => posts.filter((post) => {
    const categoryMatch = postFilter === "すべて" || post.category === postFilter;
    const text = `${post.title} ${post.body} ${post.tags.join(" ")}`.toLowerCase();
    return categoryMatch && text.includes(query.toLowerCase());
  }), [posts, postFilter, query]);

  const jump = (label: string, id: string) => {
    setActive(label);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const saveGarage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = { name: String(data.get("name")), rank: String(data.get("rank")), car: String(data.get("car")), story: Number(data.get("story")), course: String(data.get("course")) };
    setGarage(next); localStorage.setItem("wangan-base.garage", JSON.stringify(next)); setModal(null);
  };

  const addPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Post = { id: Date.now(), category: String(data.get("category")), title: String(data.get("title")), body: String(data.get("body")), author: `${garage.rank} / ${garage.name}`, tags: [String(data.get("tag") || "初心者")], likes: 0, time: "たった今" };
    const updated = [next, ...posts]; setPosts(updated); localStorage.setItem("wangan-base.posts", JSON.stringify(updated)); setModal(null); jump("コミュニティ", "community");
  };

  return (
    <main>
      <header className="site-header">
        <button className="brand" onClick={() => jump("ホーム", "top")} aria-label="WANGAN BASE ホーム">
          <span className="brand-mark"><i /></span><span>WANGAN <b>BASE</b><small>PLAYER COMMUNITY</small></span>
        </button>
        <nav aria-label="メインメニュー">
          {[["ホーム","top"],["攻略","guides"],["車種","cars"],["コミュニティ","community"]].map(([label,id]) => <button className={active === label ? "active" : ""} onClick={() => jump(label,id)} key={label}>{label}</button>)}
        </nav>
        <button className="garage-button" onClick={() => setModal("garage")}><span>◉</span> マイガレージ</button>
      </header>

      <section className="hero" id="top">
        <div className="road-lines" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span>●</span> WANGAN PLAYER COMMUNITY</p>
          <h1>走るほど、<br/><em>つながる。</em></h1>
          <p className="hero-lead">攻略を調べる。成長を記録する。仲間と走る。<br/>湾岸プレイヤーのための、深夜の攻略基地。</p>
          <div className="hero-actions"><button className="primary" onClick={() => jump("攻略","guides")}>攻略を見つける <span>→</span></button><button className="secondary" onClick={() => setModal("post")}>＋ 投稿する</button></div>
          <div className="live"><span className="pulse" /> <b>128</b> DRIVERS ONLINE <i/> UPDATE 02 AUG. 2026</div>
        </div>
        <aside className="garage-card">
          <div className="card-top"><span>MY GARAGE</span><button onClick={() => setModal("garage")}>編集 ↗</button></div>
          <div className="rank-row"><div><small>DRIVER RANK</small><strong>{garage.rank}</strong></div><div className="driver"><small>DRIVER</small><b>{garage.name}</b><span>{garage.car}</span></div></div>
          <div className="goal-head"><div><small>STORY PROGRESS</small><b>{garage.story} <span>/ {target.next}話</span></b></div><strong>{progress}%</strong></div>
          <div className="progress"><i style={{ width: `${progress}%` }} /></div>
          <div className="next-goal"><span>→</span><div><small>NEXT TARGET</small><b>{target.next}話クリアで {target.hp}馬力</b><em>{target.label}</em></div></div>
        </aside>
      </section>

      <section className="ticker"><span>NOW TRENDING</span><div>01　C1内回り・赤コーナー攻略</div><div>02　ストーリー80話までの最短ルート</div><div>03　初心者向け車種ガイド</div></section>

      <section className="section" id="guides">
        <div className="section-title"><div><p className="kicker">COURSE GUIDE</p><h2>コースを知れば、<br/><em>もっと速くなる。</em></h2></div><p>壁接触を減らし、出口速度を上げる。<br/>まずは得意なコースをひとつ作ろう。</p></div>
        <div className="course-grid">{courses.map((course, index) => <article className={`course-card ${course.color}`} key={course.name}><div className="course-number">0{index+1}</div><div className="course-route"><i/><i/><i/></div><p>{course.level}</p><h3>{course.name}</h3><span>{course.sub}</span><dl><div><dt>推奨設定</dt><dd>{course.tune}</dd></div><div><dt>練習テーマ</dt><dd>{course.note}</dd></div></dl><button onClick={() => alert(`${course.name}の詳細攻略は次回アップデートで追加予定です。`)}>攻略を見る <b>↗</b></button></article>)}</div>
      </section>

      <section className="section dark-panel" id="cars">
        <div className="section-title"><div><p className="kicker">MACHINE DATABASE</p><h2>相棒を、<em>見つける。</em></h2></div><button className="outline-button" onClick={() => setQuery("")}>全車種を見る →</button></div>
        <div className="car-list">{cars.map((car) => <article key={car[0]}><span className="car-no">{car[0]}</span><div className="car-icon">◇</div><div className="car-name"><small>{car[1]}</small><h3>{car[2]}</h3><span>{car[3]}</span></div><div className="car-stat"><small>特徴</small><b>{car[4]}</b></div><div className="car-rate"><small>初心者おすすめ</small><b>{car[5]}</b></div><button aria-label={`${car[2]}を見る`}>↗</button></article>)}</div>
      </section>

      <section className="section" id="community">
        <div className="section-title community-title"><div><p className="kicker">COMMUNITY PIT</p><h2>走りの答えは、<br/><em>ここに集まる。</em></h2></div><button className="primary" onClick={() => setModal("post")}>＋ 新しい投稿</button></div>
        <div className="community-tools"><div className="filters">{["すべて","攻略情報","質問・相談","対戦募集"].map(filter => <button className={postFilter === filter ? "active" : ""} onClick={() => setPostFilter(filter)} key={filter}>{filter}</button>)}</div><label className="search">⌕<input value={query} onChange={e => setQuery(e.target.value)} placeholder="投稿を検索" /></label></div>
        <div className="post-grid">{filteredPosts.map(post => <article key={post.id}><div className="post-meta"><span>{post.category}</span><time>{post.time}</time></div><h3>{post.title}</h3><p>{post.body}</p><div className="tags">{post.tags.map(tag => <span key={tag}>#{tag}</span>)}</div><footer><b>{post.author}</b><button onClick={() => { const updated=posts.map(item=>item.id===post.id?{...item,likes:item.likes+1}:item); setPosts(updated); localStorage.setItem("wangan-base.posts", JSON.stringify(updated)); }}>♡ {post.likes}</button></footer></article>)}</div>
      </section>

      <section className="cta"><p className="kicker">YOUR NEXT RUN STARTS HERE</p><h2>次の1プレイを、<br/><em>今日より速く。</em></h2><p>現在の進捗を記録すると、次にやるべきことが見えてくる。</p><button className="primary" onClick={() => setModal("garage")}>マイガレージを更新 <span>→</span></button></section>

      <footer className="footer"><div className="brand"><span className="brand-mark"><i /></span><span>WANGAN <b>BASE</b></span></div><p>ファンによる非公式コミュニティサイトです。ゲームメーカーおよび権利者各社とは関係ありません。<br/>ゲーム名、車名、商標等は各権利者に帰属します。</p><div><a href="#guides">攻略</a><a href="#community">投稿ガイドライン</a><a href="#top">サイトについて</a></div></footer>

      <nav className="mobile-nav">{[["⌂","ホーム","top"],["⌁","攻略","guides"],["＋","投稿","post"],["♢","ガレージ","garage"]].map(([icon,label,id]) => <button onClick={() => id === "post" || id === "garage" ? setModal(id) : jump(label,id)} key={label}><b>{icon}</b>{label}</button>)}</nav>

      {modal && <div className="modal-backdrop" role="presentation" onMouseDown={() => setModal(null)}><section className="modal" role="dialog" aria-modal="true" aria-label={modal === "garage" ? "マイガレージを編集" : "新しい投稿"} onMouseDown={e => e.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)}>×</button>{modal === "garage" ? <><p className="kicker">MY GARAGE</p><h2>進捗を更新する</h2><form onSubmit={saveGarage}><label>プレイヤーネーム<input name="name" defaultValue={garage.name} required /></label><div className="form-row"><label>ランク<input name="rank" defaultValue={garage.rank} required /></label><label>ストーリー話数<input name="story" type="number" min="0" max="100" defaultValue={garage.story} required /></label></div><label>使用車種<input name="car" defaultValue={garage.car} required /></label><label>練習中のコース<select name="course" defaultValue={garage.course}>{courses.map(c=><option key={c.name}>{c.name}</option>)}</select></label><button className="primary">保存する →</button></form></> : <><p className="kicker">NEW POST</p><h2>コミュニティへ投稿</h2><form onSubmit={addPost}><label>カテゴリー<select name="category"><option>攻略情報</option><option>質問・相談</option><option>対戦募集</option><option>店舗情報</option></select></label><label>タイトル<input name="title" required placeholder="聞きたいこと・共有したいこと" /></label><label>本文<textarea name="body" required rows={4} placeholder="プレイヤーに伝わるように詳しく書いてください" /></label><label>タグ<input name="tag" placeholder="例：C1、初心者" /></label><button className="primary">投稿する →</button></form></>}</section></div>}
    </main>
  );
}
