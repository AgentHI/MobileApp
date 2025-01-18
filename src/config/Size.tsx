import { Dimensions } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const getDeviceHeight =()=>{
    return Dimensions?.get('window')?.height
}
export const getDeviceWidth =()=>{
    return Dimensions?.get('window')?.width
}
export const getPrimaryButtonHeight =()=>{
    return Dimensions?.get('window')?.height *0.055
}
export const getPrimaryFontSize =()=>{
    return Dimensions?.get('window')?.height*0.02
}
export const AutoScaledFont =( value : number = 25)=>{
    // LOG('AutoScaledFont', Dimensions?.get('window')?.height * value *0.001)
    return Dimensions?.get('window')?.height * value *0.001
}

export const getAdjustableFont =(factor:number)=>{
    return Dimensions?.get('window')?.height/factor
}
export const getLogoSize =(sizeDenom:number)=>{
    return Dimensions?.get('window')?.height/sizeDenom
}
export const getPrimaryTextInputSize =()=>{
    return Dimensions?.get('window')?.height/17
}
export const getPrimaryTextInputFont =()=>{
    return Dimensions?.get('window')?.height/55
}

export const getHPinPercentage =(value : number)=> {
return hp(`${value}%`)
}
export const getWPinPercentage =(value : number)=> {
return wp(`${value}%`)
}