import React from 'react';
import { View, Text, Image } from 'react-native';
import LottieView from 'lottie-react-native';

const AnimationWoman = () => (
  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
    <LottieView
      source={require('../../assets/womanLogin.json')}
      autoPlay
      loop={true}
      style={{ width: 170, height: 170 }}
    />
  </View>
);
export default AnimationWoman;