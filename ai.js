export async function onRequest(context) {
  // 跨域头必须写死，确保浏览器允许访问
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
    const { prompt } = await request.json();
    
    // 你的密钥（已经确认正确）
    const apiKey = env.VOLC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ result: "❌ 请检查 Cloudflare 环境变量" }), { headers, status: 400 });
    }

    // 你的模型 ID（截图里确认过）
    const modelId = "doubao-1-5-lite-32k-250115";
    
    // 火山引擎接口地址
    const apiUrl = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

    // 直接构造请求，调用AI
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
    
    // 如果返回错误，直接捕获
    if (data.error) {
      return new Response(JSON.stringify({ result: `❌ AI调用失败: ${data.error.message}` }), { headers, status: 500 });
    }

    const result = data.choices?.[0]?.message?.content || "✅ 生成成功";
    
    // 正常返回结果
    return new Response(JSON.stringify({ result }), { headers });

  } catch (error) {
    // 捕获所有网络错误，返回友好提示
    return new Response(JSON.stringify({ result: `❌ 网络错误/连接失败: ${error.message}` }), { headers, status: 500 });
  }
}
