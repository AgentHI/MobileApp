import { Animated, Easing } from "react-native";

export const floatingLogoUpward = (AnimatedValue : Animated.Value, toValue:number, duration:number, nonNegativeValue:boolean= true )=>{
    Animated.timing(AnimatedValue, {
        toValue: nonNegativeValue ? -toValue : toValue, // Adjust the value based on how much you want to move the logo up
        duration: duration, // Duration of the animation in milliseconds
        useNativeDriver: true,
        easing: Easing.ease,
      }).start();
}
export const floatingViewSlide = (AnimatedValue : Animated.Value, toValue:number, duration:number, nonNegativeValue:boolean= true )=>{
    Animated.timing(AnimatedValue, {
        toValue: nonNegativeValue ? -toValue : toValue, // Adjust the value based on how much you want to move the logo up
        duration: duration, // Duration of the animation in milliseconds
        useNativeDriver: true,
        easing: Easing.linear, // the style of animation
      }).start();
}