import express from "express";
import dotenv from "dotenv";

import routes from "./routes";

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
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
