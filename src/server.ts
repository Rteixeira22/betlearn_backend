import App from "./app";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const app = new App();

// Connect to database and start server
app.connectDatabase();
app.startServer(PORT);
