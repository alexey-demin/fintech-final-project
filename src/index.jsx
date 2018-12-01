import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import App from './App';
import './index.css';
import reducer from './reducers';
import 'jsplumb';
import './react-contextmenu.css';
import { loadNodesFromDB } from './actions/nodeAction';
import { loadConnectionsFromDB } from './actions/connectionAction';
import { loadThemeSettingsFromDB } from './actions/appAction';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

store.dispatch(loadThemeSettingsFromDB());
store.dispatch(loadNodesFromDB());
store.dispatch(loadConnectionsFromDB());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
