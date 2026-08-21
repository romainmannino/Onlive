import React,{forwardRef}from'react';
import{Platform,Text as RNText,TextInput as RNTextInput,TextProps,TextInputProps}from'react-native';

const appFontFamily=Platform.select({ios:'System',android:'sans-serif',default:'System'});

export const Text=forwardRef<RNText,TextProps>(({style,...props},ref)=>(
  <RNText ref={ref} {...props} style={[{fontFamily:appFontFamily},style]}/>
));
Text.displayName='OnliveText';

export const TextInput=forwardRef<RNTextInput,TextInputProps>(({style,...props},ref)=>(
  <RNTextInput ref={ref} {...props} style={[{fontFamily:appFontFamily},style]}/>
));
TextInput.displayName='OnliveTextInput';
