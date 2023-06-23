import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

const Input = ({...props}) => {
    return (
      <View>
        <TextInput {...props} />
      </View>
    );
  };
  
  export default Input;