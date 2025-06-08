import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen({ navigation }: any) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Inscription</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={{ padding: 15, backgroundColor: '#10b981', borderRadius: 8 }}
      >
        <Text style={{ color: 'white' }}>Retour à la connexion</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
} 