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
  apis: [
    process.env.NODE_ENV === "production"
      ? "dist/swagger/*.swagger.js"
      : "src/swagger/*.swagger.ts",
  ],
};

export const swaggerSpecs = swaggerJSDoc(options);
