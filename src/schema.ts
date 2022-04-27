import { buildSchema } from "graphql";
import * as fs from "fs";
import path from "path";

export const schema = buildSchema(
  fs.readFileSync(path.join(__dirname, "..", "schema.graphql"), {
    encoding: "utf-8",
  })
);
