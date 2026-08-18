import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Root from './src/Root';

export default function App(){
  return(
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}} edges={['bottom']}>
        <Root/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
