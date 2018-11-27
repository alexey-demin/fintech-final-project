import { combineReducers } from 'redux';

import nodes from './nodes';
import connections from './connections';
import editNode from './editNode';
import themeSettings from './themeSettings';

export default combineReducers({
  nodes,
  connections,
  editNode,
  themeSettings
});
