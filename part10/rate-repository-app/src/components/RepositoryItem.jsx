import { View, StyleSheet, Image } from 'react-native';
import theme from '../theme';
import Text from './Text';

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.large,
    backgroundColor: theme.colors.white,
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: theme.spacing.large,
  },
  avatar: {
    width: theme.image.avatar,
    height: theme.image.avatar,
    borderRadius: theme.roundness.small,
    marginRight: theme.spacing.large,
  },
  info: {
    flexShrink: 1,
  },
  name: {
    marginBottom: theme.spacing.small,
  },
  description: {
    marginBottom: theme.spacing.medium,
  },
  language: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
    borderRadius: theme.roundness.small,
    overflow: 'hidden',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
});

const formatThousands = (value) => {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
};

const RepositoryItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image style={styles.avatar} source={{ uri: item.ownerAvatarUrl }} />
        <View style={styles.info}>
          <Text fontWeight="bold" fontSize="subheading" style={styles.name}>
            {item.fullName}
          </Text>
          <Text color="textSecondary" style={styles.description}>
            {item.description}
          </Text>
          <Text style={styles.language}>{item.language}</Text>
        </View>
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.statItem}>
          <Text fontWeight="bold">{formatThousands(item.stargazersCount)}</Text>
          <Text color="textSecondary">Stars</Text>
        </View>
        <View style={styles.statItem}>
          <Text fontWeight="bold">{formatThousands(item.forksCount)}</Text>
          <Text color="textSecondary">Forks</Text>
        </View>
        <View style={styles.statItem}>
          <Text fontWeight="bold">{item.reviewCount}</Text>
          <Text color="textSecondary">Reviews</Text>
        </View>
        <View style={styles.statItem}>
          <Text fontWeight="bold">{item.ratingAverage}</Text>
          <Text color="textSecondary">Rating</Text>
        </View>
      </View>
    </View>
  );
};

export default RepositoryItem;