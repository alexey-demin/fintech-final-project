import idb from 'idb';
const dbName = 'mindmapDBTest';
const nodesTableName = 'nodesTable';
const connectionsTableName = 'connectionsTable';

const openDB = async() => {
  const db = await idb.open(dbName, 2, upgradeDB => {
    upgradeDB.createObjectStore(nodesTableName, { autoIncrement: false });
    upgradeDB.createObjectStore(connectionsTableName, { autoIncrement: false });
  });

  return db;
};

export async function clearDB() {
  const db = await openDB();

  await db.transaction([nodesTableName], 'readwrite').objectStore(nodesTableName).clear();
  await db.transaction([connectionsTableName], 'readwrite').objectStore(connectionsTableName).clear();
}

export async function getAllNodes() {
  const db = await openDB();

  const nodes = await db.transaction([nodesTableName], 'readonly').objectStore(nodesTableName).getAll();

  return nodes;
}

export async function addOrUpdateNodeInDB(node) {
  const db = await openDB();

  await db.transaction([nodesTableName], 'readwrite').objectStore(nodesTableName).put(node, node.id.toString());
}

export async function deleteNodeFromDB(id, connections) {
  const db = await openDB();

  connections.map(async x => {
    await db.transaction([connectionsTableName], 'readwrite')
      .objectStore(connectionsTableName).delete(x.id.toString());
  });
  await db.transaction([nodesTableName], 'readwrite').objectStore(nodesTableName).delete(id.toString());
}

export async function getAllConnections() {
  const db = await openDB();

  const connections = await db.transaction([connectionsTableName], 'readonly').objectStore(connectionsTableName).getAll();

  return connections;
}

export async function addOrUpdateConnectionInDB(connection) {
  const db = await openDB();

  await db.transaction([connectionsTableName], 'readwrite').objectStore(connectionsTableName).put(connection, connection.id.toString());
}
