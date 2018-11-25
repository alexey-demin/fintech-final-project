import { combineReducers } from 'redux';

import nodes from './nodes';
import connections from './connections';
import editNode from './editNode';
import editConnection from './editConnection';

export default combineReducers({
  nodes,
  connections,
  editNode,
  editConnection
});
