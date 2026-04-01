// ================= 直接复制这里 =================
const CONFIG = {
    // 👇👇 只改这里！！！
    VOLC_API_KEY: "8d9c3a7c-7cf8-47e5-ae51-cbd66d25d22c",

    MODEL_ID: "doubao-1-5-lite-32k-250115",
    API_URL: "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
};

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

    const promptText = `给${age}宝宝做${category}的辅食，推荐具体食谱，包含食材、详细做法、营养亮点，并附上相关抖音视频链接。`;

    const resultDiv = document.querySelector('.result-box') || document.createElement('div');
    resultDiv.className = 'result-box';
    resultDiv.innerHTML = "<p>正在连接AI...</p>";
    
    const buttonContainer = document.querySelector('.button-container') || document.querySelector('.pink-button').parentElement;
    if (!document.querySelector('.result-box')) {
        buttonContainer.after(resultDiv);
    }

    try {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': CONFIG.VOLC_API_KEY
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
