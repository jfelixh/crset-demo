/* eslint-disable @typescript-eslint/no-require-imports */
const credentialsContext = require("credentials-context");

const testContext = new Map([
  ...credentialsContext.contexts,
  [
    "https://www.w3.org/2018/credentials/examples/v1",
    require("./vc_examples.json"),
  ],
  ["http://schema.org", require("./schema")],
  ["https://www.w3.org/2018/credentials/v1", require("./vc.json")],
  ["https://w3id.org/security/suites/ed25519-2020/v1", require("./ed.json")],
  [
    "https://w3c-ccg.github.io/vc-status-list-2021/contexts/v1.jsonld",
    require("./sl2021.json"),
  ],
]);

export default testContext;