import assert from "node:assert/strict";
import test from "node:test";

// ここまで入っていたのは、サイトを作る前の雛形が持っていたテストだった。
// 「Your site is taking shape」というローディング画面と
// app/_sites-preview/SkeletonPreview.tsx を検証していたが、どちらも
// すでに無く、実行すると ENOENT で落ちる状態のまま残っていた。
// CI からも呼ばれていなかったため、誰も気づかないまま死んでいた。
// 姉妹サイト（INITIAL D START LINE）と同じ形に置き換える。

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  });
}

test("運営者ひとりのプレイ記録として描画される", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /WANGAN BASE/);
  assert.match(html, /運営者ひとりが書いていく/);
  // 雛形のローディング画面が戻っていないこと
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|react-loading-skeleton/);
});

test("最新の記録が出ている", async () => {
  const html = await (await render()).text();
  // 過去の記録は下に残るので、古い文字列で検証すると更新されていなくても
  // 通ってしまう。いちばん新しいものを見る。記録を足したらここも直す。
  assert.match(html, /連装キング/);
  assert.match(html, /全国分身という遊び方を知った/);
  assert.match(html, /2026年9月5日/);
});

// 架空の利用者データを二度と載せないための番人。
// 2026年9月2日に、架空のドライバー名・ストーリー進捗・固定のオンライン人数・
// 投稿3件・車種投票の得票数・貢献ドライバーのランキング・月額390円の会員制度・
// 未登録のBOOTH商品を削除した。同じものが戻ってきたら、ここで落ちる。
test("実在しない利用者を装う表示が含まれない", async () => {
  const html = await (await render()).text();
  for (const pattern of [
    /DRIVERS ONLINE/,
    /128/,
    /貢献ドライバー/,
    /TOP SUPPORTER/,
    /月額390円/,
    /参考になった \d/,
    /いいね \d/,
    /得票/,
  ]) {
    assert.doesNotMatch(html, pattern);
  }
});
