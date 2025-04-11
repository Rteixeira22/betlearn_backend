import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API BetLearn",
    version: "1.0.0",
    description: "API da BetLearn para testar rotas.",
  },
  basePath: "/api",
  servers: [
    {
      url: "https://api-betlearn-wine.vercel.app/api/",
      description: "API hospedada na Vercel",
    },
    /* {
      url: "http://localhost:3000/api/",
      description: "API local para desenvolvimento",
    }, */
  ],
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "routes", "*Routes.ts")],
};

console.log("Diretório atual:", process.cwd());
const glob = require("glob");
const files = glob.sync("./src/routes/*Routes.ts");
console.log("Arquivos encontrados:", files);

export const swaggerSpecs = swaggerJSDoc(options);
