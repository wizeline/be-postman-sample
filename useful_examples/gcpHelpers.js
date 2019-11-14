/* eslint-disable no-await-in-loop */
const { Storage } = require("@google-cloud/storage");
const kms = require("@google-cloud/kms");

const setEnvironmentVariable = keyValue => {
  const keyValueArray = keyValue.split("=");
  const key = keyValueArray[0].toUpperCase();
  const value = keyValueArray[1];

  if (process.env[key] !== undefined) {
    console.log(
      `Environment variable: ${key} was already set in the console or CLI, skipping`
    );
    return;
  }
  console.log(`Setting env variable: ${key}`);

  process.env[key] = value;
};

const getBucketFile = async (bucketName, file) => {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);

  try {
    const dataBuffer = await bucket.file(file).download();
    return dataBuffer;
  } catch (error) {
    throw new Error(error);
  }
};

const secretsToEnv = async (encryptedFiles, locationId, projectId, keyRing) => {
  const client = new kms.KeyManagementServiceClient();

  // encrypted content
  for (let i = 0; i < encryptedFiles.length; i += 1) {
    try {
      const { file, key } = encryptedFiles[i];
      const keyName = client.cryptoKeyPath(projectId, locationId, keyRing, key);
      const fileName = file;
      const bufferFromStorage = await getBucketFile(
        keyRing,
        `${key}/${fileName}`
      );
      // if no buffer, log error and return
      const ciphertext = bufferFromStorage[0].toString("base64");
      const [result] = await client.decrypt({ name: keyName, ciphertext });
      const keyValue = result.plaintext.toString();
      setEnvironmentVariable(keyValue.trim());
    } catch (error) {
      throw new Error(error);
    }
  }
  return Promise.resolve();
};

module.exports = {
  getBucketFile,
  secretsToEnv
};
