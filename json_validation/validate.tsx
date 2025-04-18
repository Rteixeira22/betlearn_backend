const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

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
            items: { type: "string", enum: ["V", "D", "E"] }
          }
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
          "form"
        ]
      }
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
              "x": { type: "number", minimum: 1 },
              "2": { type: "number", minimum: 1 }
            },
            required: ["1", "x", "2"]
          },
          goals_local_team: { type: "integer", minimum: 0 },
          goals_visitor_team: { type: "integer", minimum: 0 },
          schedule: { type: "string", pattern: "^(\\d{2}):(\\d{2})$" }
        },
        required: [
          "id",
          "local_team",
          "visitor_team",
          "odds",
          "goals_local_team",
          "goals_visitor_team",
          "schedule"
        ]
      }
    }
  },
  required: [
    "championship_id",
    "championship_name",
    "round",
    "generated_at",
    "classification",
    "games"
  ]
};

// Função para validar e enviar o JSON para a API
async function validateAndUploadChampionship(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(data);

    const validate = ajv.compile(schema);
    const valid = validate(jsonData);

    if (!valid) {
      console.error("Invalid JSON:", validate.errors);
      return;
    }

    console.log("Valid JSON. Uploading to the API...");

    // Enviar o JSON para a API
    const API_URL = process.env.VERCEL_URL;
    if (!API_URL) {
      throw new Error("VERCEL_URL environment variable is not defined.");
    }

    const payload = {
      json: JSON.stringify(jsonData)
    };

    const response = await axios.post(`${API_URL}/championships`, payload, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("Upload successful:", response.data);
  } catch (error) {
    console.error("Error uploading JSON:", error.response?.data || error.message);
  }
}

// Caminho para o arquivo JSON
const filePath = path.join(__dirname, "championship.json");

// Validar e enviar o arquivo JSON
validateAndUploadChampionship(filePath);