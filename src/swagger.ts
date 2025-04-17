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

import fs from "fs";
import path from "path";
console.log("Caminho em produção:", process.cwd());

// Listar arquivos no diretório atual
fs.readdirSync(process.cwd()).forEach((file) => {
  console.log("Arquivo ou pasta encontrado:", file);
});

// Listar arquivos no subdiretório dist (se existir)
const distPath = path.join(process.cwd(), "dist");
if (fs.existsSync(distPath)) {
  fs.readdirSync(distPath).forEach((file) => {
    console.log("Arquivo ou pasta em dist:", file);
  });
}

export const swaggerSpecs = swaggerJSDoc(options);
