import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import * as SecureStore from 'expo-secure-store';
import theme from '../config/theme';
import { Feather, FontAwesome } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: 'exp://localhost' }, // Change for production
      });

      if (error) throw error;

      if (data?.session) {
        await SecureStore.setItemAsync('access_token', data.session.access_token);
        await SecureStore.setItemAsync('user_id', data.user.id);
      }

      router.push('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Social login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (data?.session) {
        await SecureStore.setItemAsync('access_token', data.session.access_token);
        await SecureStore.setItemAsync('user_id', data.user.id);
      }

      router.push('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Uthotho Maps</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Feather 
            name={showPassword ? 'eye' : 'eye-off'} 
            size={24} 
            color="gray" 
            style={styles.eyeIcon} 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      {/* Google & Facebook Icons in One Row */}
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: '#DB4437' }]} 
          onPress={() => handleSocialLogin('google')}
        >
          <FontAwesome name="google" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: '#4267B2' }]} 
          onPress={() => handleSocialLogin('facebook')}
        >
          <FontAwesome name="facebook" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/auth/register" asChild>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 30,
  },
  input: {
    backgroundColor: `${theme.colors.dark}05`,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: theme.colors.dark,
    width: '100%',
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.dark}05`,
    borderRadius: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: theme.colors.dark,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: 20,
  },
  iconButton: {
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: theme.colors.dark,
    fontSize: 16,
  },
  footerLink: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
