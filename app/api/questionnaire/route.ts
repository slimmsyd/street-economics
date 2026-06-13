/**
 * Questionnaire submit endpoint — writes one page to the "S3 Questionnaires"
 * Notion database and returns the auto-incremented Response ID for the
 * thank-you screen. Ported from the handoff's api/submit.js.
 *
 * Required env var (set in the deploy's project settings, e.g. Vercel):
 *   NOTION_TOKEN        — Internal integration secret ("ntn_…" / "secret_…")
 * Optional:
 *   NOTION_DATABASE_ID  — defaults to the S3 Questionnaires database below
 *
 * If NOTION_TOKEN is absent the handler returns 200 with `recorded: false` so
 * the client quietly keeps its fallback № (the form still completes).
 */

import { NextResponse } from "next/server";

const DEFAULT_DB_ID = "191dbff4-668c-4124-ab6c-8f8201618b93";
const NOTION_VERSION = "2022-06-28";

// answer-id -> Notion property name, grouped by Notion property type
const TEXT_FIELDS: Record<string, string> = {
  why: "Why Joined",
  where_extra: "Where Detail",
  building: "Building",
  industry_extra: "Industry Other",
  time: "Time Sink",
  bottleneck: "Bottleneck",
  ai_tools_extra: "AI Tools Other",
  ai_use: "AI Use",
  ai_stop: "AI Blocker",
  ai_wish: "AI Wish",
  hardest: "Content Hardest",
  tried: "Tried Before",
  discord: "Discord Tag",
};
const SELECT_FIELDS: Record<string, string> = {
  ai: "Uses AI",
  ai_pay: "AI Pay Tier",
  ai_stance: "AI Stance",
  content: "Creates Content",
  start: "Want To Start",
  solve: "Qualifier",
};
const MULTI_FIELDS: Record<string, string> = {
  where: "Where Now",
  industry: "Industry",
  ai_tools: "AI Tools",
  dist: "Distribution",
};

type Answers = Record<string, string | string[] | undefined>;

const richText = (v: unknown) => ({ rich_text: [{ text: { content: String(v).slice(0, 2000) } }] });
const title = (v: unknown) => ({ title: [{ text: { content: String(v).slice(0, 2000) } }] });
const nonEmpty = (v: unknown) => v != null && String(v).trim() !== "";

export async function POST(req: Request) {
  let body: { answers?: Answers; submittedAt?: string; userAgent?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const token = process.env.NOTION_TOKEN;
  // No backend configured — let the client keep its fallback № gracefully.
  if (!token) {
    return NextResponse.json({ recorded: false, respNo: "" }, { status: 200 });
  }
  const dbId = process.env.NOTION_DATABASE_ID || DEFAULT_DB_ID;

  const a: Answers = body.answers || {};
  const props: Record<string, unknown> = {};

  // Title — use the bottleneck (the strategic field), fall back to "why".
  const summarySrc = nonEmpty(a.bottleneck) ? a.bottleneck : nonEmpty(a.why) ? a.why : "New response";
  props["Summary"] = title(String(summarySrc).trim().slice(0, 80));

  if (nonEmpty(body.submittedAt)) props["Submitted At"] = { date: { start: body.submittedAt } };
  if (nonEmpty(body.userAgent)) props["User Agent"] = richText(body.userAgent);
  if (nonEmpty(a.email)) props["Email"] = { email: String(a.email).trim() };

  for (const id in TEXT_FIELDS) if (nonEmpty(a[id])) props[TEXT_FIELDS[id]] = richText(a[id]);
  for (const id in SELECT_FIELDS) if (nonEmpty(a[id])) props[SELECT_FIELDS[id]] = { select: { name: String(a[id]) } };
  for (const id in MULTI_FIELDS) {
    const arr = a[id];
    if (Array.isArray(arr) && arr.length) {
      props[MULTI_FIELDS[id]] = { multi_select: arr.filter(nonEmpty).map((n) => ({ name: String(n) })) };
    }
  }

  try {
    const notionRes = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parent: { database_id: dbId }, properties: props }),
    });

    const json = await notionRes.json();
    if (!notionRes.ok) {
      console.error("Notion error", notionRes.status, json);
      return NextResponse.json({ error: "Notion write failed", detail: json?.message }, { status: 502 });
    }

    // Read back the auto-incremented Response ID.
    const uid = json.properties?.["Response ID"]?.unique_id;
    let respNo = "RESPONSE № RECORDED";
    if (uid && typeof uid.number === "number") {
      const num = String(uid.number).padStart(4, "0");
      respNo = "RESPONSE № " + (uid.prefix ? uid.prefix + "-" : "") + num;
    }
    return NextResponse.json({ recorded: true, respNo, id: json.id }, { status: 200 });
  } catch (err) {
    console.error("Submit handler error", err);
    return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });
  }
}
