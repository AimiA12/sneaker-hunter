import axios from 'axios';

// 从 Vercel 环境变量读取，不要把真实的 Key 写在这里
const DEWU_TOKEN = process.env.DEWU_TOKEN;

export default async function handler(req, res) {
    // 允许跨域请求
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { sku } = req.query;

    if (!sku) {
        return res.status(400).json({ error: "缺少货号参数 sku" });
    }

    if (!DEWU_TOKEN) {
        return res.status(500).json({ error: "服务器未配置 DEWU_TOKEN，请在 Vercel 后台设置" });
    }

    try {
        const dewuUrl = `http://124.221.95.244:8001/searchdw?apikey=${DEWU_TOKEN}&huohao=${sku}`;
        const response = await axios.get(dewuUrl, { timeout: 8000 });

        if (response.data && response.data.data) {
            // 提取并简化数据，只给前端需要的部分
            const formattedData = response.data.data.map(item => ({
                size: item.size,
                price: item.price / 100, // 假设单位是分，转为元
                title: item.title
            }));
            res.status(200).json({ formatted_dewu: formattedData });
        } else {
            res.status(404).json({ error: "得物未查询到该货号数据" });
        }
    } catch (error) {
        console.error("得物接口请求失败:", error.message);
        res.status(502).json({ error: "第三方得物接口暂时无法连接" });
    }
}
