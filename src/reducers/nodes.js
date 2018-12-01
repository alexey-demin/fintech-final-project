const initialState = [];

export default function nodes(state = initialState, action) {
  switch (action.type) {
    case 'ADD_NODE':
      return [
        ...state,
        action.node
      ];
    case 'DELETE_NODE':
      return [...state.filter(x => x.id !== action.id)];
    case 'LOAD_NODES_SUCCESS':
      return [...state, ...action.nodes];
    case 'CHANGE_NODE':
    case 'UPDATE_POSITION_NODE': {
      const index = state.findIndex(x => x.id === action.node.id);

      return [...state.slice(0, index),
        action.node,
        ...state.slice(index + 1)];
    }
    case 'CLEAR_NODES':
      return initialState;
    default:
      return state;
  }
}
