import React from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>OSN (Old School Navigation) is a simple compass app written in React using Expo.</Text>
      <Ionicons name="globe-outline" size={24} color="black" onPress={() => Linking.openURL('https://www.dominikivosic.com/')} />
      <Text style={styles.linkText} onPress={() => Linking.openURL('https://www.dominikivosic.com/')}>
        Visit My Website
      </Text>
      <Ionicons name="logo-github" size={24} color="black" onPress={() => Linking.openURL('https://github.com/SlavicPixel')} />
      <Text style={styles.linkText} onPress={() => Linking.openURL('https://github.com/SlavicPixel')}>
        My GitHub
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center'
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginVertical: 5,
  }
});
