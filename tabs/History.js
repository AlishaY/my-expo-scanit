import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import Home from './Home';

export default function History() {
  const [count,setCount] = useState(0);
  const inputRef = useRef(null);

  const increment = () => setCount(count + 1);

  return (
    <View style={styles.container}>
      <Text>HISTORY PAGE! count: {count}</Text>
      <Button onClick={increment} title='increment'></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
