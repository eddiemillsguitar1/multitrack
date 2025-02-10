import React, { useState } from 'react';
import { TextInput, Button, View, Text } from 'react-native';
import { DlnaClient } from 'react-native-dlna'; // Assuming DLNA library is used

export default function App() {
  const [movieUrl, setMovieUrl] = useState('');
  const [message, setMessage] = useState('');

  const castToFirestick = async () => {
    if (!movieUrl) {
      setMessage('Please enter a movie URL.');
      return;
    }

    try {
      // Initialize the DLNA Client
      const client = new DlnaClient();
      
      // Discover devices (this could find your Fire TV Stick)
      const devices = await client.search();
      const firestick = devices.find(device => device.name.includes('Fire TV')); // Customize as needed

      if (firestick) {
        // Connect to the Fire TV Stick
        await client.connect(firestick);

        // Send the movie URL to Fire TV Stick
        await client.playUrl(movieUrl);
        setMessage('Movie is playing on Fire TV Stick!');
      } else {
        setMessage('No Fire TV Stick found on the network.');
      }
    } catch (error) {
      setMessage('Error casting to Fire TV Stick: ' + error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter Movie URL:</Text>
      <TextInput
        value={movieUrl}
        onChangeText={setMovieUrl}
        placeholder="Enter movie URL"
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
          paddingLeft: 10,
        }}
      />
      <Button title="Cast to Fire TV Stick" onPress={castToFirestick} />
      <Text>{message}</Text>
    </View>
  );
}
