import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import betsRoutes from "./routes/betsRoutes";
import tipsRoutes from "./routes/tipsRoutes";
import challengesRoutes from "./routes/challengesRoutes";
import gamesRoutes from "./routes/gamesRoutes";
import leaderboardRoutes from "./routes/leaderboardRoutes";
import championshipsRoutes from "./routes/championshipsRoutes";
import questionnaireRoutes from "./routes/questionnaireRoutes";
import stepsRoutes from "./routes/stepsRoutes";
import { PrismaClient } from "@prisma/client";

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
    this.app.use("/api/leaderboard", leaderboardRoutes);
    this.app.use("/api/championships", championshipsRoutes);
    this.app.use("/api/questionnaire", questionnaireRoutes);
    this.app.use("/api/steps", stepsRoutes);
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
