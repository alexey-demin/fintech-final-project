import { getAllConnections, addOrUpdateConnectionInDB } from '../db/indexedDB';

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
