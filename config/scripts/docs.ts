import fs from "fs";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

import config from "/config";
import log from "/logger";

const docsDir = path.join(config.CONST.ROOT_PATH, "docs");
const docsLocation = path.join(docsDir, "openapi.json");

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RETS API",
      version: "{{VERSION}}",
      description: "Exymple REST API for GitLab CI/CD demonstration purpose",
      license: {
        name: "MIT",
        url: "https://opensource.org/license/mit"
      }
    },
    servers: [
      {
        url: "http://{{HOST}}"
      }
    ],
    security: []
  },
  apis: [path.join(config.CONST.ROOT_PATH, "src", "app.ts")]
};

((): void => {
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
  }
  fs.writeFile(
    docsLocation,
    JSON.stringify(swaggerJsdoc(options), null, 2),
    "utf8",
    (err) => {
      if (!err) {
        log.info(`OpenAPI docs generated successfully! (${docsLocation})`);

        return;
      }

      log.error(err.message);
    }
  );
})();
