import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  const { skuData } = req.body;

  const prompt = `你是一个顶尖的全球球鞋二级市场分析专家，专注于美区 StockX 市场。
  
  任务要求：
  1. 重点分析美区市场的真实成交记录、销售频率和当前挂单深度。
  2. 评估该货号在二级市场的流动性。
  3. 分析价格稳定性，是否存在价格虚高或流动性陷阱。
  4. 为每个货号给出明确的投资评级（强烈推荐/建议关注/谨慎入场）。
  
  注意：利润数据 (profitRMB) 均已转换为人民币 RMB 结算。
  
  待分析数据：
  ${JSON.stringify(skuData, null, 2)}
  
  输出规范：
  - 使用 Markdown 格式。
  - 严禁输出全文总结或整体建议，仅针对单个货号进行独立分析。
  - 语言风格：专业、犀利、数据驱动。
  - 结构：[货号] -> [美区市场现状] -> [销量分析] -> [风险提示] -> [最终建议]。
  - 结尾必须包含："仅采用 AI 进行客观分析，仅供参考，不构成投资建议。"`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    res.status(200).json({ text: result.response.text() });
  } catch (error) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: "AI 分析失败" });
  }
}