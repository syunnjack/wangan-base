"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Garage = { name: string; rank: string; car: string; story: number; course: string };
type Post = { id: number; category: string; title: string; body: string; author: string; tags: string[]; likes: number; replies: number; time: string };

const defaultGarage: Garage = { name: "NIGHT★RUNNER", rank: "C8", car: "SKYLINE GT-R (BNR32)", story: 32, course: "C1" };
const initialPosts: Post[] = [
  { id: 1, category: "質問・相談", title: "大阪のセッティングは何馬力がおすすめ？", body: "ストーリーを進めながら大阪を練習中です。壁に当たりにくい設定を知りたいです。", author: "C8 / R32", tags: ["大阪", "初心者"], likes: 24, replies: 0, time: "12分前" },
  { id: 2, category: "攻略情報", title: "C1内回り、赤コーナーで失速しない進入", body: "ひとつ手前から外へ寄せ、短いアクセルオフで姿勢を作ると出口が安定します。", author: "B3 / RX-8", tags: ["C1", "ライン取り"], likes: 61, replies: 8, time: "38分前" },
  { id: 3, category: "対戦募集", title: "今週末、初心者同士で走りませんか？", body: "勝敗より練習重視。フルチューン前でも歓迎です。", author: "C5 / EVO IX", tags: ["対戦募集", "初心者歓迎"], likes: 18, replies: 4, time: "1時間前" },
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

const pollCars = [
  { name: "SKYLINE GT-R (BNR32)", votes: 184 },
  { name: "RX-8 (SE3P)", votes: 156 },
  { name: "LANCER Evolution IX", votes: 121 },
  { name: "SKYLINE GT-R (BNR34)", votes: 98 },
];

const contributors = [
  { rank: 1, name: "APEX_32", score: 1280, badge: "攻略王" },
  { rank: 2, name: "ROTARY8", score: 1045, badge: "ベスト回答" },
  { rank: 3, name: "NIGHT EVO", score: 920, badge: "募集マスター" },
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

const boothUrl = process.env.NEXT_PUBLIC_BOOTH_URL || "https://booth.pm/";

const revenueLinks = {
  booth: boothUrl,
  support: process.env.NEXT_PUBLIC_SUPPORT_URL || "mailto:support@midnightpit.jp?subject=MIDNIGHT%20PIT%E3%82%B5%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%BC%E7%99%BB%E9%8C%B2",
  partner: process.env.NEXT_PUBLIC_PARTNER_URL || "mailto:partner@midnightpit.jp?subject=MIDNIGHT%20PIT%E6%8E%B2%E8%BC%89%E3%81%AE%E3%81%94%E7%9B%B8%E8%AB%87",
};

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
  const [postSeed, setPostSeed] = useState("");
  const [vote, setVote] = useState("");
  const [arcadeQuery, setArcadeQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedGarage = localStorage.getItem("wangan-base.garage");
      const savedPosts = localStorage.getItem("wangan-base.posts");
      const savedVote = localStorage.getItem("wangan-base.vote");
      if (savedGarage) setGarage(JSON.parse(savedGarage));
      if (savedPosts) setPosts((JSON.parse(savedPosts) as Post[]).map(post => ({ ...post, replies: post.replies ?? 0 })));
      if (savedVote) setVote(savedVote);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const target = targetFor(garage.story);
  const progress = Math.min(100, Math.round((garage.story / target.next) * 100));
  const filteredArcadeAreas = useMemo(() => arcadeAreas.filter(({ region, prefecture }) => `${region} ${prefecture}`.toLowerCase().includes(arcadeQuery.toLowerCase())), [arcadeQuery]);
  const filteredPosts = useMemo(() => posts.filter((post) => {
    const categoryMatch = postFilter === "すべて" || (postFilter === "未回答" ? post.category === "質問・相談" && post.replies === 0 : post.category === postFilter);
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
    const next: Post = { id: Date.now(), category: String(data.get("category")), title: String(data.get("title")), body: String(data.get("body")), author: `${garage.rank} / ${garage.name}`, tags: [String(data.get("tag") || "初心者")], likes: 0, replies: 0, time: "たった今" };
    const updated = [next, ...posts]; setPosts(updated); localStorage.setItem("wangan-base.posts", JSON.stringify(updated)); setPostSeed(""); setModal(null); jump("コミュニティ", "community");
  };

  const castVote = (car: string) => {
    if (vote) return;
    setVote(car);
    localStorage.setItem("wangan-base.vote", car);
  };

  return (
    <main>
      <header className="site-header">
        <button className="brand" onClick={() => jump("ホーム", "top")} aria-label="WANGAN BASE ホーム">
          <span className="brand-mark"><i /></span><span>WANGAN <b>BASE</b><small>PLAYER COMMUNITY</small></span>
        </button>
        <nav aria-label="メインメニュー">
          {[["ホーム","top"],["攻略","guides"],["車種","cars"],["店舗","arcades"],["コミュニティ","community"]].map(([label,id]) => <button className={active === label ? "active" : ""} onClick={() => jump(label,id)} key={label}>{label}</button>)}
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


      <section className="section arcade-section" id="arcades">
        <div className="section-title">
          <div><p className="kicker">ARCADE DIRECTORY</p><h2>全国の設置店を、<br/><em>探す。</em></h2></div>
          <p>湾岸ミッドナイト マキシマムチューン 6RR PLUS<br/>公式設置店舗情報（2026年8月12日確認）</p>
        </div>
        <div className="arcade-notice"><span>LIVE SOURCE</span><p>全国47都道府県・48エリアを網羅。店舗名・住所・設置台数は、各エリアの公式最新一覧で確認できます。</p></div>
        <label className="arcade-search">⌕<input value={arcadeQuery} onChange={event => setArcadeQuery(event.target.value)} placeholder="都道府県・地方名で検索" /></label>
        <div className="arcade-regions">
          {arcadeRegions.map(region => {
            const areas = filteredArcadeAreas.filter(area => area.region === region);
            if (!areas.length) return null;
            return <article className="arcade-region" key={region}><header><span>{String(arcadeRegions.indexOf(region) + 1).padStart(2, "0")}</span><h3>{region}</h3></header><div>{areas.map(area => <a href={officialLocationUrl(area.area)} target="_blank" rel="noreferrer" key={area.prefecture}><b>{area.prefecture}</b><span>公式設置店を見る ↗</span></a>)}</div></article>;
          })}
        </div>
        <aside className="arcade-partner">
          <div><span className="pr-chip">PR掲載枠</span><p className="kicker">FOR ARCADE OPERATORS</p><h3>大会・交流会を、近くのプレイヤーへ。</h3><p>店舗のイベントや初心者歓迎デーを、地域別ディレクトリとコミュニティで告知できます。PR表記、掲載期間、レポート内容を事前に明示します。</p></div>
          <div className="partner-offer"><small>店舗・イベント掲載</small><strong>掲載プランを相談</strong><span>地域掲載 / 募集投稿 / 表示レポート</span><a href={revenueLinks.partner}>掲載について問い合わせる →</a></div>
        </aside>
        <p className="arcade-disclaimer">設置情報・台数はリアルタイム反映ではありません。未掲載・撤去済みの場合もあるため、来店前に各店舗へ直接ご確認ください。情報提供元：バンダイナムコエクスペリエンス公式サイト。公式一覧の掲載順位は変更せず、有料掲載は「PR」と明示します。</p>
      </section>

      <section className="section" id="community">
        <div className="section-title community-title"><div><p className="kicker">COMMUNITY PIT</p><h2>走りの答えは、<br/><em>ここに集まる。</em></h2></div><button className="primary" onClick={() => setModal("post")}>＋ 新しい投稿</button></div>
        <div className="ugc-boost">
          <article className="daily-topic"><div><span className="live-badge">TODAY&apos;S TOPIC</span><p>今日のお題</p><h3>あなたが最初に「壁接触ゼロ」を達成したコースは？</h3></div><button onClick={() => { setPostSeed("初めて壁接触ゼロを達成したコース"); setModal("post"); }}>お題に答える →</button></article>
          <article className="contribution-card"><p className="kicker">YOUR CONTRIBUTION</p><strong>{posts.filter(post => post.author.includes(garage.name)).length}</strong><span>POSTS</span><div><b>次のバッジまであと1投稿</b><i><em /></i></div></article>
          <article className="answer-call"><p className="kicker">PIT SUPPORT</p><strong>{posts.filter(post => post.category === "質問・相談" && post.replies === 0).length}</strong><span>未回答の質問</span><button onClick={() => setPostFilter("未回答")}>最初の回答者になる →</button></article>
        </div>
        <div className="engagement-grid">
          <section className="poll-panel">
            <div className="panel-heading"><div><p className="kicker">WEEKLY POLL</p><h3>初心者にすすめたい1台は？</h3></div><span>{pollCars.reduce((sum, car) => sum + car.votes, 0) + (vote ? 1 : 0)} VOTES</span></div>
            <div className="poll-options">{pollCars.map(car => { const votes = car.votes + (vote === car.name ? 1 : 0); const total = pollCars.reduce((sum, item) => sum + item.votes, 0) + (vote ? 1 : 0); return <button className={vote === car.name ? "selected" : ""} disabled={Boolean(vote)} onClick={() => castVote(car.name)} key={car.name}><span>{car.name}</span><i><em style={{ width: `${Math.round(votes / total * 100)}%` }} /></i><b>{Math.round(votes / total * 100)}%</b></button> })}</div>
            <p className="vote-note">{vote ? `「${vote}」に投票しました。` : "タップするだけで投票できます。結果は投票後も表示されます。"}</p>
          </section>
          <section className="ranking-panel">
            <div className="panel-heading"><div><p className="kicker">PIT RANKING</p><h3>今週の貢献ドライバー</h3></div><span>WEEKLY</span></div>
            <ol>{contributors.map(driver => <li key={driver.rank}><strong>0{driver.rank}</strong><div><b>{driver.name}</b><span>{driver.badge}</span></div><em>{driver.score.toLocaleString()} PT</em></li>)}</ol>
            <p>投稿・回答・共感された回数からポイントを集計</p>
          </section>
        </div>
        <div className="community-tools"><div className="filters">{["すべて","攻略情報","質問・相談","未回答","対戦募集"].map(filter => <button className={postFilter === filter ? "active" : ""} onClick={() => setPostFilter(filter)} key={filter}>{filter}</button>)}</div><label className="search">⌕<input value={query} onChange={e => setQuery(e.target.value)} placeholder="投稿を検索" /></label></div>
        <div className="post-grid">{filteredPosts.map(post => <article key={post.id}><div className="post-meta"><span>{post.category}</span><time>{post.time}</time></div><h3>{post.title}</h3><p>{post.body}</p><div className="tags">{post.tags.map(tag => <span key={tag}>#{tag}</span>)}</div><footer><b>{post.author}</b><div className="post-actions"><span>↳ {post.replies}</span><button aria-label={`${post.title}に共感する`} onClick={() => { const updated=posts.map(item=>item.id===post.id?{...item,likes:item.likes+1}:item); setPosts(updated); localStorage.setItem("wangan-base.posts", JSON.stringify(updated)); }}>♡ {post.likes}</button></div></footer></article>)}</div>
        {filteredPosts.length === 0 && <div className="empty-posts"><p>この条件の投稿はまだありません。</p><button onClick={() => setModal("post")}>最初の投稿をする →</button></div>}
      </section>

      <section className="section revenue-section" id="support">
        <div className="section-title"><div><p className="kicker">SUPPORT THE PIT</p><h2>この場所を、<br/><em>一緒に育てる。</em></h2></div><p>攻略情報はこれまで通り無料。<br/>応援とパートナー掲載が運営を支えます。</p></div>
        <div className="revenue-quick">
          <div><p className="kicker">CHOOSE YOUR SUPPORT</p><h3>好きな方法で、運営を支援。</h3></div>
          <a href={revenueLinks.booth} target="_blank" rel="noreferrer"><b>単発で応援</b><span>BOOTHで支援アイテムを見る ↗</span></a>
          <a href={revenueLinks.support}><b>月額メンバー</b><span>¥390 / 月 →</span></a>
          <a href={revenueLinks.booth} target="_blank" rel="noreferrer"><b>公式ショップ</b><span>BOOTHでアイテムを見る ↗</span></a>
        </div>
        <div className="revenue-grid">
          <article className="support-plan">
            <div className="revenue-label">FOR DRIVERS</div><p className="kicker">PIT CREW MEMBERSHIP</p><h3>ピットクルー</h3><div className="price"><strong>¥390</strong><span>/ 月</span></div>
            <ul><li>プロフィールに限定バッジ</li><li>広告を控えめに表示</li><li>新機能への先行投票</li><li>月次の活動レポート</li></ul>
            <a className="revenue-cta" href={revenueLinks.support}>サポーターになる →</a><small>いつでも解除できます</small>
          </article>
          <article className="gear-guide">
            <div className="revenue-label pr">BOOTH SHOP</div><p className="kicker">WANGAN BASE ITEMS</p><h3>デジタルアイテムで応援</h3><p>壁紙、活動レポート、支援アイテムなどをBOOTHで販売予定。購入は外部のBOOTHショップで安全に手続きできます。</p>
            <div className="gear-items"><span>01　デジタル壁紙</span><span>02　活動レポート</span><span>03　単発支援アイテム</span></div>
            <a className="revenue-cta secondary-cta" href={revenueLinks.booth} target="_blank" rel="noreferrer">BOOTHショップを見る ↗</a><small>外部サイトへ移動します。デジタル商品は内容を確認してからご購入ください</small>
          </article>
          <article className="partner-plan">
            <div className="revenue-label sponsor">FOR PARTNERS</div><p className="kicker">SPONSORED PIT</p><h3>店舗・イベント掲載</h3><p>大会、交流会、ゲームセンターの情報を、地域とプレイヤー層に合わせて届けます。</p>
            <dl><div><dt>掲載枠</dt><dd>トップ / 地域 / 募集</dd></div><div><dt>レポート</dt><dd>表示・クリック数</dd></div><div><dt>表記</dt><dd>PRを明示</dd></div></dl>
            <a className="revenue-cta secondary-cta" href={revenueLinks.partner}>掲載を相談する →</a><small>内容を確認してから掲載します</small>
          </article>
        </div>
        <p className="revenue-policy">MIDNIGHT PITは、広告や提携の有無によって攻略評価を変更しません。広告・スポンサー投稿には「PR」を明記します。BOOTHでの販売収益はサイト運営に使用します。</p>
      </section>

      <section className="cta"><p className="kicker">YOUR NEXT RUN STARTS HERE</p><h2>次の1プレイを、<br/><em>今日より速く。</em></h2><p>現在の進捗を記録すると、次にやるべきことが見えてくる。</p><button className="primary" onClick={() => setModal("garage")}>マイガレージを更新 <span>→</span></button></section>

      <footer className="footer"><div className="brand"><span className="brand-mark"><i /></span><span>WANGAN <b>BASE</b></span></div><p>ファンによる非公式コミュニティサイトです。ゲームメーカーおよび権利者各社とは関係ありません。<br/>ゲーム名、車名、商標等は各権利者に帰属します。</p><div><a href="#guides">攻略</a><a href="#community">投稿ガイドライン</a><a href="#support">運営を支援</a><a href="#top">サイトについて</a></div></footer>

      <nav className="mobile-nav">{[["⌂","ホーム","top"],["⌁","攻略","guides"],["＋","投稿","post"],["♢","ガレージ","garage"]].map(([icon,label,id]) => <button onClick={() => id === "post" || id === "garage" ? setModal(id) : jump(label,id)} key={label}><b>{icon}</b>{label}</button>)}</nav>

      {modal && <div className="modal-backdrop" role="presentation" onMouseDown={() => setModal(null)}><section className="modal" role="dialog" aria-modal="true" aria-label={modal === "garage" ? "マイガレージを編集" : "新しい投稿"} onMouseDown={e => e.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)}>×</button>{modal === "garage" ? <><p className="kicker">MY GARAGE</p><h2>進捗を更新する</h2><form onSubmit={saveGarage}><label>プレイヤーネーム<input name="name" defaultValue={garage.name} required /></label><div className="form-row"><label>ランク<input name="rank" defaultValue={garage.rank} required /></label><label>ストーリー話数<input name="story" type="number" min="0" max="100" defaultValue={garage.story} required /></label></div><label>使用車種<input name="car" defaultValue={garage.car} required /></label><label>練習中のコース<select name="course" defaultValue={garage.course}>{courses.map(c=><option key={c.name}>{c.name}</option>)}</select></label><button className="primary">保存する →</button></form></> : <><p className="kicker">NEW POST</p><h2>コミュニティへ投稿</h2>{postSeed && <p className="post-prompt">今日のお題：{postSeed}</p>}<form onSubmit={addPost}><label>カテゴリー<select name="category"><option>攻略情報</option><option>質問・相談</option><option>対戦募集</option><option>店舗情報</option></select></label><label>タイトル<input name="title" defaultValue={postSeed} required placeholder="聞きたいこと・共有したいこと" /></label><label>本文<textarea name="body" required rows={4} placeholder="プレイヤーに伝わるように詳しく書いてください" /></label><label>タグ<input name="tag" defaultValue={postSeed ? "今日のお題" : ""} placeholder="例：C1、初心者" /></label><button className="primary">投稿する →</button></form></>}</section></div>}
    </main>
  );
}
