import { getAllConnections, addOrUpdateConnectionInDB, deleteConnectionFromDB } from '../db/indexedDB';

export const loadConnectionsFromDB = () => async dispatch => {
  const connections = await getAllConnections();

  dispatch({ type: 'LOAD_CONNECTIONS_SUCCESS', connections });
};

export const addConnection = connection => async dispatch => {
  await addOrUpdateConnectionInDB(connection);
  dispatch({ type: 'ADD_CONNECTION', connection });
};

export const changeColorConnection = connection => async dispatch => {
  await addOrUpdateConnectionInDB(connection);
  dispatch({ type: 'CHANGE_COLOR_CONNECTION', connection });
};

export const deleteConnection = connection => async dispatch => {
  await deleteConnectionFromDB(connection);
  dispatch({ type: 'DELETE_CONNECTION', connection });
};
