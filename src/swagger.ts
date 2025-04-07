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
      url: "http://localhost:3000/api",
      description: "Pedido via servidor local direto à API",
    },
    {
      url: "https://api-betlearn-wine.vercel.app/api/",
      description: "Pedido via API hospedada na Vercel",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["src/routes/*Routes.ts"],
};

export const swaggerSpecs = swaggerJSDoc(options);
