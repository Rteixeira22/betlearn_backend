import swaggerJSDoc from "swagger-jsdoc";
import glob from "glob";
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

// Determina o caminho das rotas com base no ambiente
const apisPath =
  process.env.NODE_ENV === "production"
    ? "dist/routes/*Routes.js" // Caminho para produção
    : "src/routes/*Routes.ts"; // Caminho para desenvolvimento

console.log(`Swagger está a procurar em: ${apisPath}`);

// Lista os arquivos encontrados no caminho especificado
const files = glob.sync(apisPath);
console.log("Arquivos encontrados:");
console.log(files);

const options = {
  swaggerDefinition,
  apis: files, // Passa os arquivos encontrados para o Swagger
};

export const swaggerSpecs = swaggerJSDoc(options);
