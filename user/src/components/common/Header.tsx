import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  actions?: React.ReactNode[];
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  actions = [],
  subtitle,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <Animated.View 
      entering={FadeInDown.duration(300)}
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
    >
      <Appbar.Header style={styles.header}>
        {showBack && (
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        )}
        <Appbar.Content 
          title={title} 
          subtitle={subtitle}
          titleStyle={styles.title}
        />
        {actions.map((action, index) => (
          <View key={index}>{action}</View>
        ))}
      </Appbar.Header>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  header: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default Header;