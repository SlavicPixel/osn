import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { Magnetometer } from 'expo-sensors';

const { width } = Dimensions.get('window');
const COMPASS_SIZE = width * 0.8; 

export default function App() {
  const [currentDirection, setCurrentDirection] = useState('N'); 
  const [currentDegrees, setCurrentDegrees] = useState('0'); 
  const angle = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    Magnetometer.setUpdateInterval(1000);

    const subscription = Magnetometer.addListener(result => {
      const newAngle = calculateAngle(result);
      setCurrentDegrees(`${Math.round(newAngle)}`);
      setCurrentDirection(calculateDirection(newAngle));

      Animated.timing(angle, {
        toValue: -newAngle, 
        duration: 500,
        useNativeDriver: true
      }).start();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const calculateAngle = ({ x, y }) => {
    if (!x || !y) {
      return 0;
    }
    let newAngle = Math.atan2(y, x) * (180 / Math.PI) + 180;
    return newAngle;
  };

  const calculateDirection = (angle) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
    return directions[index];
  };

  const spin = angle.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg']
  });

  return (
    <View style={styles.container}>
        <View style={styles.info}>
            <Text style={styles.infoText}>{currentDirection}</Text>
            <Text style={styles.infoText}>{currentDegrees}°</Text>
        </View>
      <Animated.View style={[styles.compassCircle, { transform: [{ rotate: spin }] }]}>
        <Text style={[styles.direction, styles.north]}>N</Text>
        <Text style={[styles.direction, styles.northeast]}>NE</Text>
        <Text style={[styles.direction, styles.east]}>E</Text>
        <Text style={[styles.direction, styles.southeast]}>SE</Text>
        <Text style={[styles.direction, styles.south]}>S</Text>
        <Text style={[styles.direction, styles.southwest]}>SW</Text>
        <Text style={[styles.direction, styles.west]}>W</Text>
        <Text style={[styles.direction, styles.northwest]}>NW</Text>
      </Animated.View>
      <Text style={styles.arrow}>↑</Text>
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
  compassCircle: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  direction: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
  },
  north: { top: '5%' },
  northeast: { top: '15%', right: '15%' },
  east: { right: '5%' },
  southeast: { bottom: '15%', right: '15%' },
  south: { bottom: '5%' },
  southwest: { bottom: '15%', left: '15%' },
  west: { left: '5%' },
  northwest: { top: '15%', left: '15%' },
  arrow: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'red',
    zIndex: 1, 
  },
  info: {
    position: 'absolute',
    top: COMPASS_SIZE / 3, 
    alignItems: 'center',
  },
  infoText: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
