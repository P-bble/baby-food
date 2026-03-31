export async function onRequest(context) {
  // 处理 OPTIONS 预检请求，解决跨域
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  try {
    const { request, env } = context;
    const { prompt } = await request.json();

    // 从环境变量读取 API Key
    const apiKey = env.VOLC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ result: "错误：未配置 VOLC_API_KEY 环境变量" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // ✅ 已经帮你填好你的 Endpoint ID，直接用！
    const endpointId = "doubao-1-5-lite-32k-250115";
    const url = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: endpointId,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await resp.json();
    if (data.error) {
      return new Response(JSON.stringify({ result: `AI错误：${data.error.message}` }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const result = data.choices?.[0]?.message?.content || "AI返回为空";

    return new Response(JSON.stringify({ result }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
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
