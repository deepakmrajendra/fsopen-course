// import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_REPOSITORIES } from '../graphql/queries';

const useRepositories = () => {
  // --------------------- COMMENTED OUT REST API VERSION ---------------------
  // const [repositories, setRepositories] = useState();
  // const [loading, setLoading] = useState(false);

  // const fetchRepositories = async () => {
  //   setLoading(true);

  //   // Replace the IP address part with your own IP address!
  //   // const response = await fetch('http://localhost:5001/api/repositories');
  //   const response = await fetch('http://192.168.29.58:5001/api/repositories');
  //   const json = await response.json();

  //   setLoading(false);
  //   // React's useState hook to maintain the repository list state
  //   setRepositories(json);
  // };

  // // useEffect hook to call the fetchRepositories function when the RepositoryList component is mounted
  // useEffect(() => {
  //   fetchRepositories();
  // }, []);

  // return { repositories, loading, refetch: fetchRepositories };

  // --------------------- GRAPHQL VERSION (Apollo useQuery) ---------------------
  const { data, loading, refetch } = useQuery(GET_REPOSITORIES, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    repositories: data?.repositories,
    loading,
    refetch,
  };
};

export default useRepositories;