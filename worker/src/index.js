const COURSE = {
    id: "cloudflare-workers-basics",
    title: "Cloudflare Workers 入門",
    description: "リクエストを受け取り、軽量な API として返す仕組みを学びます。",
    level: "beginner"
};

const EVENTS = [
    { id: 1, title: "Workers ハンズオン", date: "2026-09-18", place: "オンライン" },
    { id: 2, title: "Pages 公開相談会", date: "2026-09-25", place: "HAL 東京" }
];

const FORTUNES = [
    { rank: "大吉", message: "小さく試した変更が、思いがけず大きな成果につながります。" },
    { rank: "中吉", message: "レスポンスを一つずつ確認すると、次の一手が見えてきます。" },
    { rank: "吉", message: "今日の主役は準備。設定値を整理すると流れが整います。" }
];

function json(data, status, origin) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "content-type": "application/json; charset=UTF-8",
            "access-control-allow-origin": origin,
            "access-control-allow-methods": "GET, OPTIONS",
            "access-control-allow-headers": "Content-Type"
        }
    });
}

export default {
    async fetch(request, env) {
        const origin = env.ALLOWED_ORIGIN || "*";
        if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "access-control-allow-origin": origin, "access-control-allow-methods": "GET, OPTIONS", "access-control-allow-headers": "Content-Type" } });
        if (request.method !== "GET") return json({ error: "Method Not Allowed" }, 405, origin);

        const url = new URL(request.url);
        if (url.pathname === "/" || url.pathname === "/api") return json({ name: "senka-api", status: "ok", endpoints: ["/api/course", "/api/hello", "/api/fortune", "/api/events"] }, 200, origin);
        if (url.pathname === "/api/course") return json(COURSE, 200, origin);
        if (url.pathname === "/api/events") return json({ events: EVENTS }, 200, origin);
        if (url.pathname === "/api/fortune") return json(FORTUNES[new Date().getUTCDate() % FORTUNES.length], 200, origin);
        if (url.pathname === "/api/hello") {
            const name = url.searchParams.get("name")?.trim();
            if (!name) return json({ error: "name is required" }, 400, origin);
            return json({ message: `${name}さん、こんにちは！`, name }, 200, origin);
        }
        return json({ error: "Not Found" }, 404, origin);
    }
};