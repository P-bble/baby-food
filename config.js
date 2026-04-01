// 宝宝辅食记录 - 纯静态本地存储版
document.addEventListener('DOMContentLoaded', function() {
    // 初始化数据
    let foodRecords = JSON.parse(localStorage.getItem('babyFoodRecords')) || [];
    const foodListEl = document.getElementById('foodList');
    const addBtn = document.getElementById('addBtn');

    // 渲染辅食列表
    function renderList() {
        if (foodRecords.length === 0) {
            foodListEl.innerHTML = '<div class="empty-tip">暂无辅食记录，快来添加第一条吧~</div>';
            return;
        }

        // 按时间倒序排列，最新的在最上面
        foodRecords.sort((a, b) => new Date(b.time) - new Date(a.time));
        
        foodListEl.innerHTML = foodRecords.map(item => `
            <div class="food-item">
                <div class="food-time">⏰ ${formatTime(item.time)}</div>
                <div class="food-name">${item.name}（${item.category}）</div>
                <div class="food-desc">${item.desc || '无详情'}</div>
            </div>
        `).join('');
    }

    // 格式化时间显示
    function formatTime(timeStr) {
        const date = new Date(timeStr);
        return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日 ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
    }

    // 添加辅食记录
    addBtn.addEventListener('click', function() {
        const time = document.getElementById('foodTime').value;
        const name = document.getElementById('foodName').value.trim();
        const category = document.getElementById('foodCategory').value;
        const desc = document.getElementById('foodDesc').value.trim();

        if (!time || !name) {
            alert('请填写辅食时间和名称！');
            return;
        }

        // 新增记录
        foodRecords.push({
            time: time,
            name: name,
            category: category,
            desc: desc
        });

        // 保存到本地存储
        localStorage.setItem('babyFoodRecords', JSON.stringify(foodRecords));

        // 清空表单
        document.getElementById('foodTime').value = '';
        document.getElementById('foodName').value = '';
        document.getElementById('foodDesc').value = '';

        // 重新渲染列表
        renderList();
        alert('✅ 辅食记录添加成功！');
    });

    // 初始渲染
    renderList();
});
