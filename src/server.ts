import app from "./app";

import { connectToDatabase } from "./services/database.service"

const PORT = process.env.PORT ?? 8000;

connectToDatabase()
  .then(() => {
    // app.use("/games", gamesRouter);
    app.listen(PORT, () => {
      // only log this information in development.
      if (process.env?.NODE_ENV !== "production")
        console.log(`Club17 server listening at http://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Club17 database connection failed", error);
    process.exit();
  });