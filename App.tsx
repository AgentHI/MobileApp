import React from 'react';
import { Navigator } from './src/routers/Navigator';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-native-toast-notifications';
import store from './src/redux/store';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <ToastProvider>
        <Navigator />
      </ToastProvider>
    </Provider>
  );
}

export default App;