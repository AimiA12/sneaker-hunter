import fetch from 'node-fetch';

const TOKEN = process.env.STOCKX_TOKEN;
const AUTH = process.env.STOCKX_AUTH;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { sku } = req.query;

    if (!sku) return res.status(400).json({ error: "缺少货号" });
    if (!TOKEN || !AUTH) return res.status(500).json({ error: "服务器未配置 StockX 认证信息" });

    const url = `https://stockx.com/api/v1/products/${sku}/activity?limit=10&currency=USD`;

    try {
        const response = await fetch(url, {
            headers: {
                'x-api-key': TOKEN,
                'Authorization': AUTH,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(502).json({ error: "StockX 接口连接失败" });
    }
}
