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
//ADAPTA-SE AO AMBIENTE
const options = {
  swaggerDefinition,
  apis: [
    process.env.NODE_ENV === "production"
      ? "dist/routes/*Routes.js"
      : "src/routes/*Routes.ts",
  ],
};

export const swaggerSpecs = swaggerJSDoc(options);
