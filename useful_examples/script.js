let newman = require("newman");
let fs = require("fs");
const url = process.env.URL + "/graphql";
const environment = process.env.PROJECT_NAME;
const projectId = process.env.GLOBAL_PROJECT;
const keyRing = process.env.KMS_KEY_RING;
const locationId = "global";
const clientIdDev = "";
const audienceDev = "";
const clientIdQA = "";
const audienceQA = "";

const isDev = environment === "dev";
const isQA = environment === "qa";
const { secretsToEnv } = require("./gcpHelpers");

console.log(`ENV: ${environment} - URL: ${url} \
  - PROJECT_ID: ${projectId} - KEYRING: ${keyRing}`);
if (
  environment == undefined ||
  url == undefined ||
  projectId == undefined ||
  keyRing == undefined
) {
  console.log("Environment variables missing");
  process.exit(1);
}

if (!isDev && !isQA) {
  console.log("Skipping tests...");
  process.exit(0);
}

const getCredentials = async (
  encryptedFiles = [
    {
      file: "auth0_client_secret.txt.encrypted",
      key: "auth0-client-secret"
    }
  ]
) => {
  return secretsToEnv(encryptedFiles, locationId, projectId, keyRing);
};

getCredentials().then(() => {
  let myVariables = JSON.parse(
    fs
      .readFileSync("./environment/qa_graphql.postman_environment.json")
      .toString()
  );
  myVariables.values[0].value = url;
  myVariables.values[1].value = process.env.AUTH0_CLIENT_SECRET;
  myVariables.values[2].value = isDev ? clientIdDev : clientIdQA;
  myVariables.values[3].value = isDev ? audienceDev : audienceQA;

  newman.run(
    {
      collection: "./collection/Collection.postman_collection.json",
      environment: myVariables,
      reporters: "cli",
      bail: true
    },
    function(error, summary) {
      if (summary.run.failures.length > 0) {
        process.exit(1);
      }
    }
  );
});
