export async function onRequest(context) {
  try {
    const { request, env } = context;
    const { prompt } = await request.json();

    const apiKey = env.VOLC_API_KEY;
    const model = "Doubao-1.5-lite-32k";
    const url = "https://ark.cn-beijing.volcesapi.com/api/v3/chat/completions";

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await resp.json();
    const result = data.choices?.[0]?.message?.content || "AI 返回为空";

    return new Response(JSON.stringify({ result }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      result: "错误：" + err.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
