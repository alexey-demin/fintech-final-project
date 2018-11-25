const initialState = [];

export default function editConnection(state = initialState, action) {
  switch (action.type) {
    case 'START_EDIT_CONNECTION':
      return [
        action.connection
      ];
    case 'STOP_EDIT_CONNECTION':
      return [];
    default:
      return state;
  }
}
