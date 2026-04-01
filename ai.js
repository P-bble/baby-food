export async function onRequest(context) {
  // 跨域头必须写死
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  // 1. 处理 OPTIONS 预检请求
  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    const { request, env } = context;
    const body = await request.json();
    const prompt = body.prompt;
    
    // 🔥 这里读取你的环境变量
    const apiKey = env.VOLC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ result: "❌ 请检查 Cloudflare 环境变量" }), { headers, status: 400 });
    }

    const modelId = "doubao-1-5-lite-32k-250115";
    const apiUrl = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

    // 🔥 关键修改！用 X-Api-Key 而不是 Bearer
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey, // ✅ 新密钥必须用这个头
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: "system", content: "你是专业的宝宝辅食营养师，根据宝宝月龄和分类，推荐适合的辅食，包含食材、详细做法、营养亮点，并附上相关抖音视频链接。" },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return new Response(JSON.stringify({ result: `❌ AI调用失败: ${data.error.message}` }), { headers, status: 500 });
    }

    const result = data.choices?.[0]?.message?.content || "✅ 生成成功";
    
    return new Response(JSON.stringify({ result }), { headers });

  } catch (error) {
    return new Response(JSON.stringify({ result: `❌ 捕获错误: ${error.message}` }), { headers, status: 500 });
  }
}
