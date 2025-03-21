import { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config();

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.VITE_SUBGRAPH_CODEGEN_SCHEMA_ENDPOINT,
  documents: "src/graphql/queries.ts",
  config: {
    legacyMode: false,
    reactQueryVersion: 5,
  },
  generates: {
    "src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
    },
  },
};

export default config;
