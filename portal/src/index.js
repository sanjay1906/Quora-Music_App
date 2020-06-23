import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import deepPurple from '@material-ui/core/colors/deepPurple';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';
import { saveState, getState } from './localStore';

const muiTheme = createMuiTheme({
  palette: {
    primary: deepPurple,
  },
});
getState().then((localState) => {
  let store = createStore(reducers, localState);

  store.subscribe(() => {
    saveState({
      songs: store.getState().songs,
    });
  });
  ReactDOM.render(
    // eslint-disable-next-line
    <Provider store={store}>
      <MuiThemeProvider theme={muiTheme}>
        <App />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
  );
});
registerServiceWorker();
