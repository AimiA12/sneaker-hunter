import fetch from 'node-fetch';

const TOKEN = process.env.STOCKX_TOKEN;
const AUTH = process.env.STOCKX_AUTH;

export default async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { sku } = req.query;

    if (!sku) return res.status(400).json({ error: "缺少货号" });
    if (!TOKEN || !AUTH) return res.status(500).json({ error: "配置缺失" });

    const url = `https://stockx.com/api/v1/products/${sku}/activity?limit=10&currency=USD`;

    try {
        const response = await fetch(url, {
            headers: {
                'x-api-key': TOKEN,
                'Authorization': AUTH,
                'user-agent': 'Mozilla/5.0'
            }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(502).json({ error: "StockX 接口连接失败" });
    }
}
