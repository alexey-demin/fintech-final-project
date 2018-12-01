const initialState = {
  id: '1',
  connectionsColor: 'green',
  nodesColor: '#0693E3',
  backgroundColor: 'white'
};

export default function themeSettings(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_THEME_SETTINGS':
      return action.settings !== null ? action.settings : state;
    case 'CHANGE_THEME_SETTINGS':
      return action.settings;
    default:
      return state;
  }
}
