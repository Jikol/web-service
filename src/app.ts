import express from "express";
import type { Express } from "express";
import fs from "fs";
import path from "path";

import config from "/config";
import log from "/logger";

const app: Express = express();

/**
 * @openapi
 * /api/v1/foo:
 *   get:
 *     operationId: getFoo
 *     summary: Foo endpoint
 *     description: Returns a simple string to verify the API is working.
 *     responses:
 *       '200':
 *         description: Successful response with a plain message.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Bar!
 *       '400':
 *         description: >
 *           Bad request. The request could not be understood or was
 *           missing required parameters.
 *       '500':
 *         description: Internal server error.
 */
app.get("/api/v1/foo", (_req, res) => {
  res.send("Bar!");
});

/**
 * @openapi
 * /:
 *   get:
 *     operationId: getOpenapijson
 *     summary: Serve OpenAPI documentation
 *     description: Serves the OpenAPI documentation as a JSON file.
 *     responses:
 *       '200':
 *         description: The OpenAPI documentation in JSON format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The OpenAPI schema document.
 *       '404':
 *         description: The documentation file was not found.
 *       '500':
 *         description: Internal server error.
 */
app.get("/", (req, res) => {
  fs.readFile(
    path.join(config.CONST.ROOT_PATH, "docs", "openapi.json"),
    "utf8",
    (err, data) => {
      if (!err) {
        return res.json(
          JSON.parse(
            data
              .replaceAll("{{HOST}}", req.get("host") ?? "localhost")
              .replaceAll("{{VERSION}}", "latest")
          )
        );
      }

      if (err.code === "ENOENT") {
        return res.status(404).json({
          message: "The requested openapi file was not found"
        });
      }

      return res.status(500).json({
        message: err.message
      });
    }
  );
});

app.listen(config.ENVS.API_PORT, () => {
  log.info("Express started");
  log.info(`Listening on port ${config.ENVS.API_PORT}`);
});
