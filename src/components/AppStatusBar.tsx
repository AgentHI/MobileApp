import React, {useState} from 'react';
import {ColorValue, StatusBar, StatusBarStyle} from 'react-native';
import { Colors } from '../constants/Colors';

interface CustomHeaderProps {
  hidden?: boolean;
  bgcolor?: ColorValue;
  STYLES_?: number;
  translucent?: boolean;
}

const AppStatusBar = ({
  hidden = true,
  bgcolor = Colors.primary,
  STYLES_ = 0,
  translucent = false,
}: CustomHeaderProps) => {
  const STYLES = ['default', 'dark-content', 'light-content'] as const;
  const TRANSITIONS = ['fade', 'slide', 'none'] as const;
  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>(
    STYLES[STYLES_],
  );
  const [statusBarTransition, setStatusBarTransition] = useState<
    'fade' | 'slide' | 'none'
  >(TRANSITIONS[0]);

  return (
    <StatusBar
      animated={true}
      translucent={translucent}
      backgroundColor={bgcolor}
      barStyle={statusBarStyle}
      showHideTransition={statusBarTransition}
      hidden={hidden}
    />
  );
};

export default AppStatusBar;
