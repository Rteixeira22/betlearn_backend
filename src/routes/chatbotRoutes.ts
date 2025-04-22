import express from 'express';
import { Request, Response } from "express";
import axios from 'axios';

const router = express.Router();

// Verifica se a chave de API existe
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("⚠️ Chave da API Gemini não encontrada!");
}

// Rota para processar perguntas usando axios
router.post('/', async (req: Request, res: Response) => {
  const { pergunta } = req.body;

  if (!pergunta) {
    return res.status(400).json({ erro: 'Pergunta em falta.' });
  }

  try {
    // Configuração de contexto para o Gemini
    const prompt = `Você é um assistente virtual especializado em apostas educativas e desporto, da plataforma BetLearn.
    Forneça respostas concisas, amigáveis e educativas.
    Responda apenas com o conteúdo necessário, sem informações adicionais. e não ultrapasse os 200 caracteres por resposta.
    Responda sempre em português de portugal.
Caso a pergunta não esteja relacionada com apostas, diga "Desculpe mas não sei responder a essa pergunta".    
    Pergunta do utilizador: ${pergunta}`;
    
    // Chamada direta à API do Gemini com timeout de 10 segundos
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent',
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
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
    
    // Extrair a resposta da API
    const resposta = response.data.candidates[0].content.parts[0].text;
    
    return res.json({ 
      sucesso: true,
      pergunta,
      resposta 
    });
  } catch (err: any) {
    console.error('Erro ao gerar resposta:', err.response?.data || err.message);
    
    if (err.code === 'ECONNABORTED') {
      return res.status(408).json({
        sucesso: false,
        erro: 'Tempo limite excedido ao comunicar com o Gemini.',
        detalhes: 'A requisição demorou muito tempo e foi cancelada.'
      });
    }
    
    return res.status(500).json({ 
      sucesso: false,
      erro: 'Erro ao comunicar com o Gemini.',
      detalhes: err.response?.data?.error?.message || err.message
    });
  }
});

export default router;