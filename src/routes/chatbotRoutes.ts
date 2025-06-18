import axios from 'axios';
import { Request, Response } from 'express'
import { 
  ResponseHelper, 
  ChatbotRequest, 
  ChatbotResponse 
} from '../utils/chatbotResponseHelper';

const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req: Request, res: Response): Promise<void> {
  // Check HTTP method
  if (req.method !== 'POST') {
    ResponseHelper.badRequest(res, 'Método não permitido');
    return;
  } 

  // Validate API key
  if (!apiKey) {
    ResponseHelper.serverError(res, 'API key não configurada');
    return;
  }

  const { pergunta }: ChatbotRequest = req.body;

  // Validate required fields
  if (!pergunta) {
    ResponseHelper.badRequest(res, 'Pergunta em falta');
    return;
  }

  if (typeof pergunta !== 'string') {
    ResponseHelper.badRequest(res, 'Pergunta deve ser uma string');
    return;
  }

  if (pergunta.trim().length === 0) {
    ResponseHelper.badRequest(res, 'Pergunta não pode estar vazia');
    return;
  }

  if (pergunta.trim().length > 500) {
    ResponseHelper.badRequest(res, 'Pergunta muito longa (máximo 500 caracteres)');
    return;
  }

  const prompt = `Você é um assistente virtual especializado em apostas educativas e desporto, da plataforma BetLearn.
Forneça respostas concisas, amigáveis e educativas.
Responda apenas com o conteúdo necessário, sem informações adicionais. e não ultrapasse os 200 caracteres por resposta.
Responda sempre em português de portugal.
Caso a pergunta não esteja relacionada com apostas, diga "Desculpe mas não sei responder a essa pergunta".
Pergunta do utilizador: ${pergunta.trim()}`;

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

    // Validate response structure
    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      ResponseHelper.serverError(res, 'Resposta inválida do bot');
      return;
    }

    const resposta = response.data.candidates[0].content.parts[0].text;

    // Validate response content
    if (typeof resposta !== 'string' || resposta.trim().length === 0) {
      ResponseHelper.serverError(res, 'Resposta vazia do bot');
      return;
    }

    const geminiResponse: ChatbotResponse = {
      pergunta: pergunta.trim(),
      resposta: resposta.trim()
    };

    ResponseHelper.success(res, geminiResponse, 'Resposta gerada com sucesso');

  } catch (err: any) {
    console.error('Error communicating with Gemini:', err);

    // Handle specific error types
    if (err.code === 'ECONNABORTED') {
      ResponseHelper.serverError(res, 'Timeout ao comunicar com o bot');
      return;
    }

    if (err.response?.status === 401) {
      ResponseHelper.unauthorized(res, 'API key inválida');
      return;
    }

    if (err.response?.status === 403) {
      ResponseHelper.forbidden(res, 'Acesso restrito ao bot');
      return;
    }

    if (err.response?.status === 429) {
      ResponseHelper.serverError(res, 'Limite de requisições excedido');
      return;
    }

    if (err.response?.status >= 400 && err.response?.status < 500) {
      ResponseHelper.badRequest(res, 'Erro na requisição ao bot');
      return;
    }

    ResponseHelper.serverError(res, 'Erro ao comunicar com o bot');
  }
}