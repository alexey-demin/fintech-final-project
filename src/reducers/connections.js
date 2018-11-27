const initialState = [];

export default function connections(state = initialState, action) {
  switch (action.type) {
    case 'ADD_CONNECTION':
      return [
        ...state,
        action.connection
      ];
    case 'DELETE_CONNECTIONS':
      return [...state.filter(x => !action.connections.includes(x))];
    case 'LOAD_CONNECTIONS_SUCCESS':
      return [...state, ...action.connections];
    case 'CLEAR_CONNECTIONS':
      return initialState;
    default:
      return state;
  }
}
