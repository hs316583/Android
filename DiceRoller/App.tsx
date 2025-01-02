import React, { useState, useRef } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av'; // For sound effects
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'; // For animations

const App = () => {
  const [diceResult, setDiceResult] = useState(1);
  const [rollCount, setRollCount] = useState(0);
  const [bgColor, setBgColor] = useState('#f0f8ff'); // Dynamic background color
  const rotation = useSharedValue(0);

  const soundRef = useRef(null); // Ref to store the sound object

  const rollDice = async () => {
    await playSound(); // Play sound when rolling the dice
    rotation.value = withTiming(rotation.value + 360, { duration: 500 });

    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceResult(result);
      setRollCount(rollCount + 1);
      setBgColor(getRandomColor());
    }, 500);
  };

  const resetCounter = () => {
    setRollCount(0);
  };

  const playSound = async () => {
    try {
      console.log("Loading sound...");
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/dice-roll.wav') // Replace with your sound file
      );

      //@ts-ignore
      soundRef.current = sound; // Store sound object in ref

      console.log("Sound loaded successfully");
      await sound.playAsync(); // Play the sound
      console.log("Sound played successfully");

      // Set up playback status update to unload sound after it's finished playing
      sound.setOnPlaybackStatusUpdate((status) => {
        //@ts-ignore
        if (status && status.didJustFinish) {
          sound.unloadAsync(); // Unload the sound after playback finishes
          console.log("Sound unloaded after playback.");
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const getDiceImage = () => {
    switch (diceResult) {
      case 1: return require('./assets/1.png');
      case 2: return require('./assets/2.png');
      case 3: return require('./assets/3.png');
      case 4: return require('./assets/4.png');
      case 5: return require('./assets/5.png');
      case 6: return require('./assets/6.png');
      default: return require('./assets/1.png');
    }
  };

  const getRandomColor = () => {
    const colors = ['#f0f8ff', '#ffb6c1', '#add8e6', '#90ee90', '#ffa07a'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.title}>Dice Roller</Text>
      <Animated.View style={animatedStyle}>
        <Image source={getDiceImage()} style={styles.diceImage} />
      </Animated.View>
      <Text style={styles.counter}>Rolls: {rollCount}</Text>
      <TouchableOpacity style={styles.button} onPress={rollDice}>
        <Text style={styles.buttonText}>Roll Dice</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={resetCounter}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  diceImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  counter: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  resetButton: {
    backgroundColor: '#FF6347',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
