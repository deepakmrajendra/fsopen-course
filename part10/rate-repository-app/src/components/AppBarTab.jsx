import { Pressable, StyleSheet } from 'react-native';
import { Link } from 'react-router-native';
import theme from '../theme';
import Text from './Text';

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: theme.fontSizes.subheading,
    fontWeight: theme.fontWeights.bold,
    padding: 16,
  },
});

const AppBarTab = ({ children, to, onPress }) => {
  if (onPress) {
    return (
      <Pressable onPress={onPress}>
        <Text style={styles.text}>{children}</Text>
      </Pressable>
    );
  }
  
  return (
    <Pressable>
      <Link to={to}>
        <Text style={styles.text}>{children}</Text>
      </Link>
    </Pressable>
  );
};

export default AppBarTab;