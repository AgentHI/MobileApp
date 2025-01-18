import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {AutoScaledFont, getDeviceHeight, getDeviceWidth} from '../../config/Size';

interface ShimmerLoaderProps {
  isVisible: boolean;
  speed?: number;
}

const ShimmerLoader = (props: ShimmerLoaderProps) => {
  let {
    isVisible = false,
    speed = 1,
  } = props;

  React.useEffect(() => {}, []);

  return (
      <View>
        <LottieView
          style={[
            styles.referateAiAnimation,
            {height: getDeviceHeight()-AutoScaledFont(100), width: getDeviceWidth()-AutoScaledFont(40)},
          ]}
          source={require('../../animations/pageLoading.json')}
          autoPlay
          loop
          speed={speed}
        />
      </View>
  );
};

export default ShimmerLoader;

const styles = StyleSheet.create({
  referateAiAnimation: {
    alignSelf: 'center',
    marginTop: -AutoScaledFont(0),
  },
});
