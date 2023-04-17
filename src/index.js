import app from "./app.js";
import { sequelize } from "./database/database.js";

import { Constants } from "./constants/constants.js";
import { swaggerDocs } from "./routes/swagger.js";
async function main() {
  try {
    swaggerDocs(app, Constants.APP_PORT);
    sequelize.sync({ force: false });
    app.listen(Constants.APP_PORT);
  } catch (error) {
    console.log("Unable to connect to the database", error);
  }
  console.log("Connection has been established successfully to the db.");
  console.log("Server running port 4000");
}
main();

export default app;
