import axios, { AxiosError } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY ;
const API_BASE_URL = process.env.API_BASE_URL || 'https://api-betlearn-wine.vercel.app/api/';

async function generateChampionshipData() {
  const prompt = `Atua como um gerador de dados para a minha aplicação de apostas responsáveis. Preciso que crie um JSON com os seguintes dados de um campeonato fictício:
  
  1. Dados do campeonato:
  - championship_name: nome do campeonato
  - round: número da jornada (entre 6 e 27)
  - id para o campeonato (numero em string)
  - id (de 1 a 9) para cada jogo (YYYY-MM-DD)
  - data em que o campeão foi gerado
  
  2. Classificação (classification) contendo 18 equipas fictícias com os seguintes campos:
  - position: posição na tabela (1-18)
  - team: nome da equipa
  - points: pontos totais
  - wins: vitórias
  - draws: empates
  - losts: derrotas
  - goals_for: golos marcados
  - goals_against: golos sofridos
  - goals_difference: diferença de golos
  - total_matches: numero de jogos que a equipa ja fez
  - forma: últimos 5 jogos da equipa (usar siglas portuguesa (V, D, E)
  
  3. Jogos da jornada (games) contendo 9 jogos com os seguintes campos:
  - local_team: nome da equipa da casa
  - visitor_team: nome da equipa visitante
  - odds: objeto contendo as odds {"1": x.xx, "x": x.xx, "2": x.xx}
  - goals_local_team: golos marcados pela equipa da casa
  - goals_visitor_team: golos marcados pela equipa visitante
  - schedule: horário do jogo no formato "HH:MM"
  
  Sê criativo com os nomes das equipas. As odds devem ser realistas com base nas posições das equipas na tabela. Os resultados devem refletir probabilidades realistas considerando a força das equipas.
  Gere apenas o JSON sem explicações adicionais.`;

  try {
    console.log('A enviar pedido à API do Gemini...');
    
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 4000  
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        timeout: 60000 
      }
    );

    const resultado = response.data.candidates[0].content.parts[0].text;
    
    try {
      // Remove qualquer texto antes e depois do JSON (caso haja)
      const jsonMatch = resultado.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : resultado;
      
      const dadosJSON = JSON.parse(jsonString);

      
      const apiResponse = await axios.post(
        `${API_BASE_URL}/championships/`,
        { json: JSON.stringify(dadosJSON) },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Dados do campeonato adicionados à base de dados com sucesso!');
      console.log('Resposta da API:', apiResponse.data);
      
      return dadosJSON;
    } catch (parseError: any) {
      console.error('Erro ao processar o JSON recebido:', parseError.message);
      console.log('Resposta bruta recebida:', resultado);
      throw new Error('O formato da resposta não é um JSON válido');
    }
  } catch (err: any) {
    console.error('Erro ao gerar ou salvar dados do campeonato:', err.message);
    if (err.response) {
      console.error('Detalhes do erro:', err.response.data);
    }
    throw err;
  }
}

// Executa a função se este arquivo for executado diretamente
if (require.main === module) {
  // Verifica se a API key está definida
  if (!apiKey) {
    console.error('ERRO: GEMINI_API_KEY não está definida no ambiente.');
    process.exit(1);
  }
  
  generateChampionshipData()
    .then(() => {
      console.log('Processo concluído com sucesso.');
    })
    .catch((err: Error) => {
      console.error('O processo falhou:', err.message);
      process.exit(1);
    });
}

// Exporta a função para uso em outros módulos
export { generateChampionshipData };