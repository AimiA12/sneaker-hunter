import axios from 'axios';

const DEWU_TOKEN = process.env.DEWU_TOKEN;

// Vercel Serverless Function 必须这样导出
export default async function (req, res) {
    // 允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { sku } = req.query;

    if (!sku) {
        return res.status(400).json({ error: "缺少货号参数 sku" });
    }

    if (!DEWU_TOKEN) {
        return res.status(500).json({ error: "服务器未配置 DEWU_TOKEN" });
    }

    try {
        const dewuUrl = `http://124.221.95.244:8001/searchdw?apikey=${DEWU_TOKEN}&huohao=${sku}`;
        const response = await axios.get(dewuUrl, { timeout: 8000 });

        if (response.data && response.data.data) {
            res.status(200).json({ 
                formatted_dewu: response.data.data.map(item => ({
                    size: item.size,
                    price: item.price / 100,
                    title: item.title
                }))
            });
        } else {
            res.status(404).json({ error: "得物未查询到该货号" });
        }
    } catch (error) {
        res.status(502).json({ error: "第三方接口连接超时" });
    }
}
