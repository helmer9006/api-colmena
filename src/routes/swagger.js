import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

//metadata
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Test-Colmena",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: `http://${process.env.APP_HOST}:${process.env.APP_PORT}`,
        description: "Server local",
      },
    ],
  },
  apis: ["src/routes/user.js", "src/routes/auth.js"],
};

//Docs en JSON
const swaggerSpec = swaggerJSDoc(options);

//setup our docs
export const swaggerDocs = (app, port) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  console.log(`Docs http://localhost:${port}/api/docs`);
};
