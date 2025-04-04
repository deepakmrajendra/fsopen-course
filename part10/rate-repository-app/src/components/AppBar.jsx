import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import Constants from 'expo-constants';
import theme from '../theme';
import AppBarTab from './AppBarTab';
import Text from './Text';

import { useApolloClient, useQuery } from '@apollo/client';
import { GET_AUTHORIZED_USER } from '../graphql/queries';
import useAuthStorage from '../hooks/useAuthStorage';
import { useNavigate } from 'react-router-native';
import { useEffect, useState } from 'react';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBarBackground,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
});

const AppBar = () => {

  const { data, loading, refetch } = useQuery(GET_AUTHORIZED_USER, {
    fetchPolicy: 'cache-and-network',
  });

  console.log('GET_AUTHORIZED_USER query result:', data);
  
  const apolloClient = useApolloClient();
  const authStorage = useAuthStorage();
  const navigate = useNavigate();

  const [hasRefetched, setHasRefetched] = useState(false);

  // refetch `me` when component mounts and after sign in
  useEffect(() => {
    const refreshUser = async () => {
      const token = await authStorage.getAccessToken();
      if (token && !hasRefetched) {
        await refetch();
        setHasRefetched(true);
      }
    };
    refreshUser();
  }, [authStorage, refetch, hasRefetched]);

  const handleSignOut = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
    setHasRefetched(false);
    navigate('/');
  };

  const isSignedIn = Boolean(data?.me);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <AppBarTab to="/">Repositories</AppBarTab>
        {isSignedIn ? (
          <AppBarTab onPress={handleSignOut}>Sign out</AppBarTab>
        ) : (
          <AppBarTab to="/signin">Sign in</AppBarTab>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;