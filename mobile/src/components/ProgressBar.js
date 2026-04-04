import React from 'react';
import { View, StyleSheet } from 'react-native';

const widthStyles = {
  p08: 'w08',
  p10: 'w10',
  p12: 'w12',
  p15: 'w15',
  p18: 'w18',
  p20: 'w20',
  p22: 'w22',
  p24: 'w24',
  p25: 'w25',
  p27: 'w27',
  p35: 'w35',
  p58: 'w58',
};

const toneStyles = {
  green: 'green',
  blue: 'blue',
  orange: 'orange',
  teal: 'teal',
};

export default function ProgressBar({ widthKey = 'p20', tone = 'green' }) {
  const widthStyleName = widthStyles[widthKey] || 'w20';
  const toneStyleName = toneStyles[tone] || 'green';

  return (
    <View style={styles.track}>
      <View style={[styles.fill, styles[widthStyleName], styles[toneStyleName]]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E7EDF3',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  green: {
    backgroundColor: '#00C896',
  },
  blue: {
    backgroundColor: '#3B82F6',
  },
  orange: {
    backgroundColor: '#F59E0B',
  },
  teal: {
    backgroundColor: '#14B8A6',
  },
  w08: {
    width: '8%',
  },
  w10: {
    width: '10%',
  },
  w12: {
    width: '12%',
  },
  w15: {
    width: '15%',
  },
  w18: {
    width: '18%',
  },
  w20: {
    width: '20%',
  },
  w22: {
    width: '22%',
  },
  w24: {
    width: '24%',
  },
  w25: {
    width: '25%',
  },
  w27: {
    width: '27%',
  },
  w35: {
    width: '35%',
  },
  w58: {
    width: '58%',
  },
});
