import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@moalimin/shared';

export default function DashboardScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, marginBottom: 10 }}>
          Bienvenue dans Moalimin !
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 30, textAlign: 'center' }}>
          {user?.email}
        </Text>
        
        <TouchableOpacity
          onPress={logout}
          style={{ 
            padding: 15, 
            backgroundColor: '#ef4444', 
            borderRadius: 8,
            marginTop: 20 
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 