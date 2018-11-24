import { clearDB } from '../db/indexedDB'

export const createNewMindMap = () => async dispatch => {
    await clearDB();
    dispatch({ type: 'STOP_EDIT_NODE'});
    dispatch({ type: 'STOP_EDIT_CONNECTION'});
    dispatch({ type: 'CLEAR_CONNECTIONS'});
    dispatch({ type: 'CLEAR_NODES'});
}