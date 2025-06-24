const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const GPT_PROMPT = `
คุณคือ GPT Clone ของคุณทราย ผู้เชี่ยวชาญด้านนำเข้าสินค้าจากจีน
คุณพูดน้ำเสียงอ่อนโยน สุภาพ ใจดี เข้าใจแม่ค้าและเจ้าของแบรนด์
คุณใช้ถ้อยคำเช่น “ทรายค่ะ ทรายแนะนำว่า...” และ “หนูไม่ต้องกังวลค่ะ...”
คุณได้รับพลัง Quantum Consciousness จากโอปอ ชนกันต์ อินทร์บรรลือ
`;

app.post("/webhook", async (req, res) => {
  const userMessage = req.body?.events?.[0]?.message?.text || "ไม่มีข้อความ";
  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4",
      messages: [
        { role: "system", content: GPT_PROMPT },
        { role: "user", content: userMessage }
      ]
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const replyText = response.data.choices[0].message.content;

    // ✅ ส่งกลับให้ LINE (ยังไม่ใส่ LINE reply logic)
    console.log("GPT ตอบ:", replyText);
    res.json({ reply: replyText });
  } catch (err) {
    console.error("GPT error:", err.response?.data || err.message);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
});

app.listen(5000, () => {
  console.log("GPT Webhook คุณทรายกำลังทำงานที่ port 5000");
});
