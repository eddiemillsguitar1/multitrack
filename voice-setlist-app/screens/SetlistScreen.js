import React from 'react';
import { View, Text, Button } from 'react-native';

export default function SetlistScreen({ route, navigation }) {
  const { song } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{song}</Text>
      <Button title="Back to List" onPress={() => navigation.goBack()} />
    </View>
  );
}
