import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import Text from './Text';
import theme from '../theme';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useSignIn from '../hooks/useSignIn';
import { useNavigate } from 'react-router-native';

// Validation schema using Yup
const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.large,
    backgroundColor: theme.colors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    borderRadius: theme.roundness.small,
  },
  inputError: {
    borderColor: '#d73a4a',
  },
  errorText: {
    color: '#d73a4a',
    marginBottom: theme.spacing.medium,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    alignItems: 'center',
    borderRadius: theme.roundness.small,
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
  },
});

const initialValues = {
  username: '',
  password: '',
};

const SignIn = () => {

  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      const { data } = await signIn({ username, password });
      if (data?.authenticate?.accessToken) {
        console.log('Access token:', data.authenticate.accessToken);
        navigate('/'); // 👈 redirect to homepage after login
      }
    } catch (e) {
      console.error('Login failed:', e);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    // onSubmit: values => {
    //   console.log(values);
    // },
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
        autoCapitalize="none"
        onBlur={formik.handleBlur('username')}
        style={[
          styles.input,
          formik.touched.username && formik.errors.username && styles.inputError,
        ]}
      />
      {formik.touched.username && formik.errors.username && (
        <Text style={styles.errorText}>{formik.errors.username}</Text>
      )}

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        style={[
          styles.input,
          formik.touched.password && formik.errors.password && styles.inputError,
        ]}
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={styles.errorText}>{formik.errors.password}</Text>
      )}

      <Pressable onPress={formik.handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>
    </View>
  );
};

export default SignIn;