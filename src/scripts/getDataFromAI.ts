import axios from "axios";
import * as dotenv from "dotenv";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import axiosInstance from "../configs/axiosConfig";
import { console } from "inspector";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const API_BASE_URL =
  process.env.API_BASE_URL || "https://api-betlearn-wine.vercel.app/api/";

// Configuração do Ajv para validação
const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // Adiciona suporte para formatos como "date"

// Esquema de validação do JSON
const schema = {
  type: "object",
  properties: {
    championship_id: { type: "string", minLength: 1 },
    championship_name: { type: "string", minLength: 3 },
    round: { type: "integer", minimum: 6, maximum: 27 },
    generated_at: { type: "string", format: "date" },
    classification: {
      type: "array",
      minItems: 18,
      maxItems: 18,
      items: {
        type: "object",
        properties: {
          position: { type: "integer", minimum: 1, maximum: 18 },
          team: { type: "string", minLength: 3 },
          points: { type: "integer", minimum: 0 },
          wins: { type: "integer", minimum: 0 },
          draws: { type: "integer", minimum: 0 },
          losts: { type: "integer", minimum: 0 },
          goals_for: { type: "integer", minimum: 0 },
          goals_against: { type: "integer", minimum: 0 },
          goals_difference: { type: "integer" },
          total_matches: { type: "integer", minimum: 0 },
          form: {
            type: "array",
            minItems: 5,
            maxItems: 5,
            items: { type: "string", enum: ["V", "D", "E"] },
          },
        },
        required: [
          "position",
          "team",
          "points",
          "wins",
          "draws",
          "losts",
          "goals_for",
          "goals_against",
          "goals_difference",
          "total_matches",
          "form",
        ],
      },
    },
    games: {
      type: "array",
      minItems: 9,
      maxItems: 9,
      items: {
        type: "object",
        properties: {
          id: { type: "integer", minimum: 1 },
          local_team: { type: "string", minLength: 3 },
          visitor_team: { type: "string", minLength: 3 },
          odds: {
            type: "object",
            properties: {
              "1": { type: "number", minimum: 1 },
              x: { type: "number", minimum: 1 },
              "2": { type: "number", minimum: 1 },
            },
            required: ["1", "x", "2"],
          },
          goals_local_team: { type: "integer", minimum: 0 },
          goals_visitor_team: { type: "integer", minimum: 0 },
          schedule: { type: "string", pattern: "^(\\d{2}):(\\d{2})$" },
        },
        required: [
          "id",
          "local_team",
          "visitor_team",
          "odds",
          "goals_local_team",
          "goals_visitor_team",
          "schedule",
        ],
      },
    },
  },
  required: [
    "championship_id",
    "championship_name",
    "round",
    "generated_at",
    "classification",
    "games",
  ],
};
console.log("AH");
// Função para validar JSON usando o esquema definido
function validateJSON(data: any): { valid: boolean; errors: any | null } {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  return {
    valid,
    errors: valid ? null : validate.errors,
  };
}

// Vai buscar os campeonatos que já existem na base de dados
async function fetchExistingChampionships() {
  try {
    const response = await axiosInstance.get("/championships/");
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar campeonatos existentes:", error.message);
  }
}

// Mandar ao AI
const campeonatos = fetchExistingChampionships();

// Função principal para gerar dados via Gemini e validá-los antes de enviar para a API
async function generateChampionshipData() {
  const prompt = `Atua como um gerador de dados para a minha aplicação de apostas responsáveis. Preciso que crie um JSON com os seguintes dados de um campeonato fictício:
  
  1. Dados do campeonato:
  - championship_name: nome do campeonato
  - championship_id: id para o campeonato (numero em string)
  - round: número da jornada (entre 6 e 27)
  - generated_at: data em que o campeão foi gerado (formato ISO "YYYY-MM-DD")
  
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
  - form: últimos 5 jogos da equipa (usar siglas portuguesa (V, D, E))
  
  3. Jogos da jornada (games) contendo 9 jogos com os seguintes campos:
  - id: identificador único do jogo (de 1 a 9)
  - local_team: nome da equipa da casa
  - visitor_team: nome da equipa visitante
  - odds: objeto contendo as odds {"1": x.xx, "x": x.xx, "2": x.xx}
  - goals_local_team: golos marcados pela equipa da casa
  - goals_visitor_team: golos marcados pela equipa visitante
  - schedule: horário do jogo no formato "HH:MM"
  
  Sê criativo com os nomes das equipas. As odds devem ser realistas com base nas posições das equipas na tabela. Os resultados devem refletir probabilidades realistas considerando a força das equipas.
  Gere apenas o JSON sem explicações adicionais.
  
  É MUITO IMPORTANTE que o JSON gerado siga exatamente o esquema descrito acima, com todos os campos obrigatórios e no formato correto. Garante que a data 'generated_at' esteja no formato "YYYY-MM-DD".
  
  Estes são todos os campeonatos que já existem. Não te esqueças que é crucial que o campeonato novo que vais gerar tenha informações diferentes de qualquer um destes: ${campeonatos}`;

  try {
    console.log("A enviar pedido à API do Gemini...");

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 4000,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        timeout: 60000,
      }
    );

    const resultado = response.data.candidates[0].content.parts[0].text;

    try {
      // Remove qualquer texto antes e depois do JSON (caso haja)
      const jsonMatch = resultado.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : resultado;

      const dadosJSON = JSON.parse(jsonString);

      // Validar o JSON com o esquema
      console.log("A validar o JSON gerado...");
      const validationResult = validateJSON(dadosJSON);

      if (!validationResult.valid) {
        throw new Error("O JSON gerado não passou na validação de esquema");
      }

      console.log("JSON validado com sucesso. A enviar para a API...");

      // Enviar para a API apenas se o JSON for válido
      /* const apiResponse = await axios.post(
        `${API_BASE_URL}/championships/`,
        { json: JSON.stringify(dadosJSON) },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ); */

      const apiResponse = await axiosInstance.post("/championships/", {
        json: JSON.stringify(dadosJSON),
      });

      const notification = await axiosInstance.post("/admin-notifications/", {
        title: "Novo campeonato criado",
        message: `Um novo campeonato foi criado com sucesso.`,
        source: "getDataFromAI",
        type: "success",
      });

      console.log(
        "Dados do campeonato adicionados à base de dados com sucesso!"
      );

      return dadosJSON;
    } catch (parseError: any) {
      console.error(
        "Erro ao processar ou validar o JSON recebido:",
        parseError.message
      );
      throw new Error(
        "O formato da resposta não é um JSON válido ou não passou na validação"
      );
    }
  } catch (err: any) {
    console.error("Erro ao gerar ou guardar dados do campeonato:", err.message);
    if (err.response) {
      console.error("Detalhes do erro:", err.response.data);
    }
    throw err;
  }
}

// Tenta corrigir problemas comuns com a resposta do AI
async function retryWithFixes(maxAttempts = 3): Promise<any> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      console.log(`Tentativa ${attempts} de ${maxAttempts}...`);
      return await generateChampionshipData();
    } catch (error: any) {
      console.error(`Falha na tentativa ${attempts}:`, error.message);

      if (attempts >= maxAttempts) {
        console.error("Número máximo de tentativas atingido.");

        const notification = await axiosInstance.post("/admin-notifications/", {
          title: "Erro ao gerar campeonato",
          message: `Não foi possível gerar um campeonato após ${maxAttempts} tentativas.`,
          source: "getDataFromAI",
          type: "error",
        });

        throw new Error(
          `Não foi possível gerar um JSON válido após ${maxAttempts} tentativas.`
        );
      }

      // Espera um curto período antes de tentar novamente
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

// Executa a função se este arquivo for executado diretamente
if (require.main === module) {
  // Verifica se a API key está definida
  if (!apiKey) {
    console.error("ERRO: GEMINI_API_KEY não está definida no ambiente.");
    process.exit(1);
  }

  retryWithFixes()
    .then(() => {
      console.log("Processo concluído com sucesso.");
    })
    .catch((err: Error) => {
      console.error("O processo falhou:", err.message);
      process.exit(1);
    });
}

// Exporta as funções para uso em outros módulos
export { generateChampionshipData, validateJSON, retryWithFixes };
