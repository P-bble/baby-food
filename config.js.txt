const AI_CONFIG = {
  apiUrl: "/api/ai"
};

const FOOD_CATEGORIES = [
  "全部", "蔬菜类", "谷物类", "肉类", "蛋类", "水果类", "补铁", "补钙", "手指食物"
];

function getPrompt(age, category) {
  return `
你是专业宝宝辅食营养师，推荐1款适合${age}宝宝的辅食，
分类要求：${category}。
严格按以下格式输出，不要多余内容：

辅食名称：
食材：
步骤：
营养亮点：
过敏提示：
推荐抖音做法视频：
`;
}
