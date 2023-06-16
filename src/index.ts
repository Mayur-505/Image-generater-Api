// Load env variables
require("dotenv").config();
import app from "./app";

// Bootstrap application
async function bootstrap() {
  const port = parseInt(process.env.PORT || "5000");

  const server = app.listen(port, () =>
    console.log(`################################################
  🛡️  Server listening on port: ${port} 🛡️
################################################`)
  );
  server.timeout = 600000;
}

bootstrap();