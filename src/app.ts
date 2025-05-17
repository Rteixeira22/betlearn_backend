import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import betsRoutes from "./routes/betsRoutes";
import tipsRoutes from "./routes/tipsRoutes";
import challengesRoutes from "./routes/challengesRoutes";
import gamesRoutes from "./routes/gamesRoutes";
import championshipsRoutes from "./routes/championshipsRoutes";
import questionnaireRoutes from "./routes/questionnaireRoutes";
import stepsRoutes from "./routes/stepsRoutes";
import adminRoutes from "./routes/adminRoutes";
import authRoutes from "./routes/authRoutes";
import chatbotRoutes from "./routes/chatbotRoutes";
import adminNotificationRoutes from "./routes/adminNotificationRoutes";
import { PrismaClient } from "@prisma/client";

import SwaggerUi from "swagger-ui-express";
import { swaggerSpecs } from "./swagger";

import expressBasicAuth from "express-basic-auth";

import path from "path";

class App {
  public app: express.Application;
  public prisma: PrismaClient;

  constructor() {
    this.app = express();
    this.prisma = new PrismaClient();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.handleUncaughtErrors();
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    this.app.use("/api/users", userRoutes);
    this.app.use("/api/bets", betsRoutes);
    this.app.use("/api/tips", tipsRoutes);
    this.app.use("/api/challenges", challengesRoutes);
    this.app.use("/api/games", gamesRoutes);
    this.app.use("/api/championships", championshipsRoutes);
    this.app.use("/api/questionnaire", questionnaireRoutes);
    this.app.use("/api/steps", stepsRoutes);
    this.app.use("/api/admin", adminRoutes);
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/chatbot", chatbotRoutes);
    this.app.use("/api/admin-notifications", adminNotificationRoutes);
    //CONFIG SWAGGER UI PARA NÃO DAR PROBLEMA COM A VERCEL POR USAR STATIC FILES VINDOS DO NODE MODULES
    const swaggerDistPath = path.join(
      __dirname,
      "..",
      "node_modules",
      "swagger-ui-dist"
    );

    //CONFIG SWAGGER UI PARA NÃO DAR PROBLEMA COM A VERCEL
    this.app.use(
      "/api-docs",
      express.static(swaggerDistPath, { index: false }),
      expressBasicAuth({
        users: {
          [process.env.SWAGGER_USERNAME || "defaultUsername"]:
            process.env.SWAGGER_PASSWORD || "password",
        },
        challenge: true,
        realm: "BetLearn API Documentation",
      }),
      SwaggerUi.serve,
      SwaggerUi.setup(swaggerSpecs, { explorer: true })
    );
  }

  private handleUncaughtErrors() {
    this.app.use(
      (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        console.error(err.stack);
        res.status(500).send("Something broke!");
      }
    );
  }

  public async connectDatabase() {
    try {
      await this.prisma.$connect();
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Failed to connect to database", error);
      process.exit(1);
    }
  }

  public startServer(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}

export default App;
