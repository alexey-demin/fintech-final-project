import { getAllNodes, addOrUpdateNodeInDB, deleteNodeFromDB } from '../db/indexedDB'

export const loadNodesFromDB = () => async dispatch => {
    const nodes = await getAllNodes();
    dispatch({ type: 'LOAD_NODES_SUCCESS', nodes: nodes});
}

export const addNode = (node) => async dispatch => {
    await addOrUpdateNodeInDB(node);
    dispatch({ type: 'ADD_NODE', node: node });
}

export const deleteNode = (id, connections) => async dispatch => {
    await deleteNodeFromDB(id, connections);
    dispatch({ type: 'DELETE_NODE', id: id });
    dispatch({ type: 'DELETE_CONNECTIONS', id: id })
}

export const updatePositionNodeFromDB = (node) => async dispatch => {
    await addOrUpdateNodeInDB(node);
    dispatch({ type: 'UPDATE_POSITION_NODE', node: node });
}

export const changeColorNode = (node) => async dispatch => {
    await addOrUpdateNodeInDB(node);
    dispatch({ type: 'CHANGE_COLOR_NODE', node: node });
}

export const changeTextNode = (node) => async dispatch => {
    await addOrUpdateNodeInDB(node);
    dispatch({ type: 'CHANGE_TEXT_NODE', node: node });
}

export const changeCommentNode = (node) => async dispatch => {
    await addOrUpdateNodeInDB(node);
    dispatch({ type: 'CHANGE_COMMENT_NODE', node: node });
}