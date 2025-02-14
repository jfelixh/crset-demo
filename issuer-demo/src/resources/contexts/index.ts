/* eslint-disable @typescript-eslint/no-require-imports */
const credentialsContext = require("credentials-context");

const testContext = new Map([
  ...credentialsContext.contexts,
  [
    // This is the context for the Verifiable Credential Examples Data Model
    "https://www.w3.org/2018/credentials/examples/v1",
    require("./vc_examples.json"),
  ],
  ["http://schema.org", require("./schema")],
  // This is the context for the Verifiable Credential Data Model
  ["https://www.w3.org/2018/credentials/v1", require("./vc.json")],
  // This is the context for the Ed25519 signature suite
  ["https://w3id.org/security/suites/ed25519-2020/v1", require("./ed.json")],
  // This is the context for the Status List 2021 specification
  [
    "https://github.com/w3c/vc-bitstring-status-list/blob/main/contexts/2021/v1.jsonld",
    require("./sl2021.json"),
  ],
]);

export default testContext;
