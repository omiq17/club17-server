import app from "./app";

const PORT = process.env.PORT ?? 8000;

app.listen(PORT, () => {
  // only log this information in development.
  if (process.env?.NODE_ENV !== "production")
    console.log(`Club17 server listening at http://localhost:${PORT}`);
});
