import swaggerJSDoc from "swagger-jsdoc";
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
      url: "https://api-betlearn-wine.vercel.app/",
      description: "API hospedada na Vercel",
    },
    {
      url: "http://localhost:3000/",
      description: "API local para desenvolvimento",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["src/routes/*Routes.ts"],
};

export const swaggerSpecs = swaggerJSDoc(options);
