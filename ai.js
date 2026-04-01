// ================= 直接复制这里 =================
const CONFIG = {
    // 你的火山引擎 API Key (TK 开头的那串)
    VOLC_API_KEY: "8d9c3a7c-7cf8-47e5-ae51-cbd66d25d22c",
    
    // 你的模型 ID（截图里确认过，不用改）
    MODEL_ID: "doubao-1-5-lite-32k-250115",
    
    // 火山引擎接口地址
    API_URL: "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
};

// 等待页面加载完再初始化
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    const btn = document.querySelector('.pink-button');
    if (btn) {
        btn.addEventListener('click', getRecommendation);
    }
}

async function getRecommendation() {
    const ageInput = document.querySelector('input[placeholder="宝宝月龄"]');
    const categorySelect = document.querySelector('select');
    
    if (!ageInput || !categorySelect) {
        alert("未找到输入框");
        return;
    }

    const age = ageInput.value.trim();
    const category = categorySelect.value;

    if (!age) {
        alert("请输入宝宝月龄");
        return;
    }

    // 构造提问
    const promptText = `给${age}宝宝做${category}的辅食，推荐具体食谱，包含食材、详细做法、营养亮点，并附上相关抖音视频链接。`;

    const resultDiv = document.querySelector('.result-box') || document.createElement('div');
    resultDiv.className = 'result-box';
    resultDiv.innerHTML = "<p>正在连接AI...</p>";
    
    // 如果结果框不存在，添加到页面
    const buttonContainer = document.querySelector('.button-container') || document.querySelector('.pink-button').parentElement;
    if (!document.querySelector('.result-box')) {
        buttonContainer.after(resultDiv);
    }

    try {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': CONFIG.VOLC_API_KEY // 新密钥必须用这个头
            },
            body: JSON.stringify({
                model: CONFIG.MODEL_ID,
                messages: [
                    { role: "system", content: "你是专业的宝宝辅食营养师，回答简洁明了。" },
                    { role: "user", content: promptText }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            resultDiv.innerHTML = `<p style="color:red;">❌ 调用失败: ${data.error.message}</p>`;
            return;
        }

        const resultText = data.choices?.[0]?.message?.content || "✅ 获取成功";
        resultDiv.innerHTML = `<p>${resultText}</p>`;

    } catch (error) {
        resultDiv.innerHTML = `<p style="color:red;">❌ 网络错误: ${error.message}</p>`;
    }
}
// ================= 复制结束 =================
