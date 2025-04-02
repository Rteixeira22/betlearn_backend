const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");

const ajv = new Ajv({ allErrors: true });

// Define the schema based on the championship table structure
const schema = {
  type: "object",
  properties: {
    championship_name: { type: "string", minLength: 3 },
    round: { type: "integer", minimum: 6, maximum: 27 },
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
          local_team: { type: "string", minLength: 3 },
          visitor_team: { type: "string", minLength: 3 },
          odds: {
            type: "object",
            properties: {
              "1": { type: "number", minimum: 1 },
              "x": { type: "number", minimum: 1 },
              "2": { type: "number", minimum: 1 },
            },
            required: ["1", "x", "2"],
          },
          goals_local_team: { type: "integer", minimum: 0 },
          goals_visitor_team: { type: "integer", minimum: 0 },
          schedule: { type: "string", pattern: "^(\\d{2}):(\\d{2})$" },
        },
        required: [
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
  required: ["championship_name", "round", "classification", "games"],
};

// FUNCTION TO VALIDATE JSON
function validateChampionship(filePath) {
  try {
    // Read the JSON file
    const data = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(data);

    // Compile and validate the schema
    const validate = ajv.compile(schema);
    const valid = validate(jsonData);

    if (!valid) {
      console.error("Invalid JSON:", validate.errors);
      return false;
    }
    console.log("Valid JSON");
    return true;
  } catch (error) {
    console.error("Erro ao validar o JSON:", error.message);
    return false;
  }
}

// Path to the championship.json file
const filePath = path.join(__dirname, "championship.json");

// Validate the JSON file
validateChampionship(filePath);