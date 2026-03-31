export async function onRequest(context) {
  // 1. 处理 OPTIONS 预检请求，解决跨域
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
    // 2. 解析请求体，防止空请求报错
    let prompt;
    try {
      const body = await context.request.json();
      prompt = body.prompt;
    } catch (e) {
      return new Response(JSON.stringify({
        result: "错误：请求格式不正确，请检查输入"
      }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 3. 读取环境变量，严格校验
    const apiKey = context.env.VOLC_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      return new Response(JSON.stringify({
        result: "错误：VOLC_API_KEY 环境变量未配置或为空，请在 Cloudflare 后台填写"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 4. 你的模型ID（已填好，直接用）
    const modelId = "doubao-1-5-lite-32k-250115";
    const apiUrl = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

    // 5. 调用大模型
    const aiResp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: "system", content: "你是专业的宝宝辅食营养师，根据宝宝月龄和分类，推荐适合的辅食，包含食材、做法、注意事项，并附上相关抖音视频链接。" },
          { role: "user", content: prompt }
        ]
      })
    });

    // 6. 校验API响应状态
    if (!aiResp.ok) {
      const errorText = await aiResp.text();
      return new Response(JSON.stringify({
        result: `AI调用失败：HTTP ${aiResp.status}，错误信息：${errorText}`
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 7. 解析AI返回，防止空JSON
    let aiData;
    try {
      aiData = await aiResp.json();
    } catch (e) {
      const rawText = await aiResp.text();
      return new Response(JSON.stringify({
        result: `AI返回解析失败：${e.message}，原始内容：${rawText}`
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 8. 校验AI返回结构
    if (aiData.error) {
      return new Response(JSON.stringify({
        result: `AI错误：${aiData.error.message}`
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const result = aiData.choices?.[0]?.message?.content || "AI未返回有效内容，请重试";

    // 9. 返回标准JSON
    return new Response(JSON.stringify({ result }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (err) {
    // 10. 全局错误捕获，确保永远返回JSON
    return new Response(JSON.stringify({
      result: `系统错误：${err.message}`
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
