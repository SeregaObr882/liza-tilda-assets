// Secure server-side proxy example for landing leads.
// Deploy this as a serverless function / Cloudflare Worker.
// Do not place the Telegram bot token in frontend code or in this repo.

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed" }, 405);
    }

    let payload;
    try {
      payload = await request.json();
    } catch (_error) {
      return json({ ok: false, error: "invalid_json" }, 400);
    }

    const phone = safeText(payload.phone, 40);
    const name = safeText(payload.name, 80);
    const salon = safeText(payload.salonName, 120);
    const usesYClients = safeText(payload.usesYClients, 16);
    const planName = safeText(payload.planName, 80);
    const totalPrice = safeText(payload.totalPrice, 80);
    const messagesInfo = safeText(payload.messagesInfo, 120);
    const messengersInfo = safeText(payload.messengersInfo, 160);
    const extraInfo = safeText(payload.extraInfo, 120);
    const selectedMessengers = Array.isArray(payload.selectedMessengers)
      ? payload.selectedMessengers.map(function (item) { return safeText(item, 40); }).filter(Boolean).slice(0, 8)
      : [];
    const quoteSummary = safeText(payload.quoteSummary, 240);
    const sourcePage = safeText(payload.sourcePage, 400);
    const submittedAt = safeText(payload.submittedAt, 60);

    if (!phone) {
      return json({ ok: false, error: "phone_required" }, 400);
    }

    const text = [
      "Новая заявка с сайта Лиза Бот",
      "",
      "Имя: " + (name || "не указано"),
      "Телефон: " + phone,
      "Салон: " + (salon || "не указано"),
      "YClients: " + (usesYClients || "не указано"),
      "Тариф: " + (planName || "не указан"),
      "Итого: " + (totalPrice || "не рассчитано"),
      "Сообщения: " + (messagesInfo || "не указано"),
      "Каналы: " + (selectedMessengers.length ? selectedMessengers.join(", ") : (messengersInfo || "не указано")),
      "Доплата: " + (extraInfo || "не указано"),
      "Расчёт: " + (quoteSummary || "без дополнительного комментария"),
      "Страница: " + (sourcePage || "не указана"),
      "Время: " + (submittedAt || "не указано")
    ].join("\n");

    const tgResponse = await fetch(
      "https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendMessage",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: text
        })
      }
    );

    if (!tgResponse.ok) {
      return json({ ok: false, error: "telegram_send_failed" }, 502);
    }

    return json({ ok: true }, 200);
  }
};

function safeText(value, maxLen) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLen);
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://liza-ai-admin.ru",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store"
  };
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders()
    }
  });
}
