import * as config from "config";
const CosmosClient = require("@azure/cosmos").CosmosClient;

let cosmosConfig = config["cosmos"];

async function create(client, databaseId, containerId) {
  const partitionKey = cosmosConfig.partitionKey;

  /**
   * Create the database if it does not exist
   */
  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
  });
  console.log(`Created database:\n${database.id}\n`);

  /**
   * Create the container if it does not exist
   */
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey },
      { offerThroughput: 400 }
    );

  console.log(`Created container:\n${container.id}\n`);
}

module.exports = { create };
