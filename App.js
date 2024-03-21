
import React from 'react';
import { Button, LogBox, NativeModule, NativeModules, TouchableOpacity } from 'react-native';
import {
  StatusBar,
} from 'react-native';

import store from './src/store'
import { Provider } from 'react-redux'
import Navigation from './src/navigation'
import CodePush from "react-native-code-push";


StatusBar.setHidden(true);
console.disableYellowBox = true;
LogBox.ignoreAllLogs();
const App =() =>{
    return (
          <Provider store={store} >
              <Navigation />
          </Provider>
    )
}

const codePushOptions = {
    checkFrequency: CodePush.CheckFrequency.MANUAL,
}
export default CodePush(codePushOptions)(App);
