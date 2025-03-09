import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import Voice from 'react-native-voice';
import { WebView } from 'react-native-webview';

export default function HomeScreen() {
  const [songs, setSongs] = useState([]);
  const [videoLinks, setVideoLinks] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      if (event.value) {
        const recognizedText = event.value[0];
        processRecognizedText(recognizedText);
      }
      setIsListening(false);
    };

    Voice.onSpeechError = (error) => {
      console.error('Speech Recognition Error:', error);
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
    }
  };

  const processRecognizedText = async (text) => {
    const newSongs = text.split(',').slice(0, 5).map(song => song.trim());

    setSongs([...songs, ...newSongs]);

    const links = await Promise.all(newSongs.map(song => searchYouTube(song)));
    setVideoLinks([...videoLinks, ...links]);
  };

  const removeSong = () => {
    if (!selectedSong) return;

    const index = songs.indexOf(selectedSong);
    if (index !== -1) {
      const updatedSongs = [...songs];
      const updatedLinks = [...videoLinks];

      updatedSongs.splice(index, 1);
      updatedLinks.splice(index, 1);

      setSongs(updatedSongs);
      setVideoLinks(updatedLinks);
      setSelectedSong(null);
    }
  };

  const searchYouTube = async (query) => {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#1E1E1E' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 20 }}>
        Voice Setlist App
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Button title={isListening ? "Listening..." : "Add Song (Voice)"} onPress={startListening} disabled={isListening} />
        <Button title="Remove Song" onPress={removeSong} disabled={!selectedSong} />
      </View>

      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={{ fontSize: 18, color: '#FFF', marginBottom: 10 }}>Setlist</Text>
          <FlatList
            data={songs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedSong(item)}
                style={{
                  padding: 10,
                  backgroundColor: selectedSong === item ? '#444' : '#222',
                  marginBottom: 5,
                  borderRadius: 5,
                }}>
                <Text style={{ fontSize: 16, color: '#FFF' }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontSize: 18, color: '#FFF', marginBottom: 10 }}>Video Links</Text>
          <FlatList
            data={videoLinks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <WebView
                source={{ uri: item }}
                style={{ height: 80, marginBottom: 10, backgroundColor: '#000' }}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}
