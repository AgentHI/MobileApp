import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Pressable} from 'react-native';
import {get} from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../constants/Colors';
import { AutoScaledFont } from '../config/Size';

interface AiQuestionCellProps {
  item: any;
}

const AiQuestionCell = React.memo(({item}: AiQuestionCellProps) => {
  const [showAiResponseModal, setShowAiResponseModal] = React.useState(false);

  const trimmedQuestion = React.useMemo(() => {
    // return get(item, 'question', '')?.toString()?.substring(3);
    console.log('item____',item);
    
    // return get(item, 'question', '')
    return item
  }, [item]);

  const handlePress = React.useCallback(() => {
    trimmedQuestion && setShowAiResponseModal(true);
  }, [trimmedQuestion]);

  return (
    <View>
      <Pressable>
        <LinearGradient
          colors={Colors.aiQuestionBackgroundGradient}
          useAngle={true}
          angle={90}
          style={styles.gradientContainer}>
          <Text style={styles.questionTitle}>{'● '}
            {trimmedQuestion || 'No AI Generated Question Found'}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
});

export default AiQuestionCell;

const styles = StyleSheet.create({
  gradientContainer: {
    paddingHorizontal: AutoScaledFont(5),
    // paddingVertical: AutoScaledFont(3),
    // marginVertical: AutoScaledFont(4),
    borderRadius: AutoScaledFont(7),
  },
  questionTitle: {
    color: Colors.jetBlack,
    fontFamily: 'Poppins-Medium',
    fontSize: AutoScaledFont(17),
    flexWrap: 'wrap',
    marginVertical: AutoScaledFont(8),
    marginHorizontal: AutoScaledFont(5),
  },
});