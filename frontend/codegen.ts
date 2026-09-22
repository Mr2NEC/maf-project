import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * Generates typed documents from the backend schema file, so no running
 * server is needed. Run `npm run codegen` after changing a query or the API.
 */
const config: CodegenConfig = {
  schema: "../backend/src/schema.gql",
  documents: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
  ignoreNoDocuments: true,
  generates: {
    "./gql/": {
      preset: "client",
      presetConfig: { fragmentMasking: false },
      config: {
        documentMode: "string",
        enumsAsTypes: true,
        useTypeImports: true,
        scalars: { DateTime: "string" },
      },
    },
  },
};

export default config;
