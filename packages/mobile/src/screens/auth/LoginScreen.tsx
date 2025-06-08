import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@moalimin/shared';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);

    if (!result.success) {
      Alert.alert('Erreur de connexion', result.error || 'Erreur inconnue');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-islamic-50 to-primary-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6">
          <View className="flex-1 justify-center py-12">
            {/* Header */}
            <View className="mb-8 items-center">
              <Text className="text-4xl font-bold text-islamic-800 mb-2">
                مُعَلِّمِين
              </Text>
              <Text className="text-xl font-semibold text-gray-700">
                Moalimin
              </Text>
              <Text className="text-gray-600 text-center mt-2">
                Votre plateforme d'apprentissage islamique
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  placeholder="votre@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-gray-700 mb-2 font-medium">Mot de passe</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className={`rounded-lg py-4 mt-6 ${
                  loading 
                    ? 'bg-gray-400' 
                    : 'bg-islamic-600'
                }`}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="mt-8 items-center">
              <Text className="text-gray-600 mb-2">
                Vous n'avez pas de compte ?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text className="text-islamic-600 font-semibold">
                  Créer un compte
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 