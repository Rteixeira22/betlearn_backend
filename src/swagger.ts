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
  apis: (() => {
    const path =
      process.env.NODE_ENV === "production"
        ? "dist/routes/*Routes.js" // Caminho para produção
        : "src/routes/*Routes.ts"; // Caminho para desenvolvimento
    console.log(`Swagger está usando o caminho: ${path}`);
    return [path];
  })(),
};

export const swaggerSpecs = swaggerJSDoc(options);
