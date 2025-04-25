
import axios from 'axios';
import { VercelRequest, VercelResponse } from '@vercel/node';

const apiKey = process.env.GEMINI_API_KEY;

const model = process.env.GEMINI_MODEL || 'gemini-1.5-pro-002';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const { pergunta } = req.body;

  if (!pergunta) {
    return res.status(400).json({ erro: 'Pergunta em falta.' });
  }

  const prompt = `Você é um assistente virtual especializado em apostas educativas e desporto, da plataforma BetLearn.
  Forneça respostas concisas, amigáveis e educativas.
  Responda apenas com o conteúdo necessário, sem informações adicionais. e não ultrapasse os 200 caracteres por resposta.
  Responda sempre em português de portugal.
  Caso a pergunta não esteja relacionada com apostas, diga "Desculpe mas não sei responder a essa pergunta".    
  Pergunta do utilizador: ${pergunta}`;
  
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1000
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        timeout: 10000
      }
    );

    const resposta = response.data.candidates[0].content.parts[0].text;

    return res.status(200).json({ sucesso: true, pergunta, resposta });
  } catch (err: any) {
    return res.status(500).json({ erro: 'Erro ao comunicar com o Gemini.', detalhes: err.message });
  }
}
