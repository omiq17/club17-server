import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { memberRoutes, userRoutes } from "./routes";

// initialize configuration
dotenv.config();

class App {
  public server;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(cors());
  }

  routes() {
    this.server.use("/api/v1/user", userRoutes);
    this.server.use("/api/v1/member", memberRoutes);
  }
}

export default new App().server;
