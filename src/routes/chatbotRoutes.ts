const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
import { Request, Response } from "express";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

router.post('/', async (req: Request, res: Response) => {
  const { pergunta } = req.body;

  if (!pergunta) {
    return res.status(400).json({ erro: 'Pergunta em falta.' });
  }

  try {
    const result = await model.generateContent(pergunta);
    const resposta = result.response.text();
    res.json({ resposta });
  } catch (err) {
    console.error('Erro ao gerar resposta:', err.message);
    res.status(500).json({ erro: 'Erro ao comunicar com o Gemini.' });
  }
});

export default router;
