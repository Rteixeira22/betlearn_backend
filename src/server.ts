import App from "./app";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function startApp() {
  const app = new App();
  const databaseConnected = await app.connectDatabase();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  // Inicie o servidor independentemente do estado da conexão do banco de dados
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  app.startServer(PORT);
}

startApp();
