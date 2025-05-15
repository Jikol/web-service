import dotenv from "dotenv";
import path from "path";
import process from "process";
import { z } from "zod";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const constants = {
  ROOT_PATH: path.resolve(process.cwd())
};

const configSchema = z.object({
  NODE_ENV: z
    .union([z.literal("development"), z.literal("production")])
    .default("production"),
  API_PORT: z.string().transform((port) => +port)
});

const parseResult = configSchema.safeParse(
  Object.entries(process.env).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value === "" ? undefined : value }),
    {}
  )
);

if (!parseResult.success) {
  throw new Error(parseResult.error.message);
}

export default { CONST: constants, ENVS: parseResult.data } as {
  CONST: typeof constants;
  ENVS: z.infer<typeof configSchema>;
};
