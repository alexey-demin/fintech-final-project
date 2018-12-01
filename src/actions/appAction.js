import { clearDB, addOrUpdateThemeSettingsInDB, getThemeSettings } from '../db/indexedDB';

export const createNewMindMap = () => async dispatch => {
  await clearDB();
  dispatch({ type: 'STOP_EDIT_NODE' });
  dispatch({ type: 'STOP_EDIT_CONNECTION' });
  dispatch({ type: 'CLEAR_CONNECTIONS' });
  dispatch({ type: 'CLEAR_NODES' });
};

export const changeThemeSettings = settings => async dispatch => {
  await addOrUpdateThemeSettingsInDB(settings);
  dispatch({ type: 'CHANGE_THEME_SETTINGS', settings });
};

export const loadThemeSettingsFromDB = () => async dispatch => {
  const result = await getThemeSettings();

  const settings = result.length !== 0 ? result[0] : null;

  dispatch({ type: 'LOAD_THEME_SETTINGS', settings });
};
