import React, {useState} from 'react';
import {StyleSheet,Text,View,Image, TouchableOpacity,Platform} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

export default function App() {

  const [selectedImage, setSelectedImage] = useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
    if(permissionResult.granted === false){
      alert('Permission to access camera is required')
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync()
    
    if(pickerResult.cancelled === true){
      return;
    }

    if(Platform.OS === 'web'){
      const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri)
      setSelectedImage({localUri: pickerResult.uri, remoteUri});
    } else {
      setSelectedImage({localUri: pickerResult.uri});
    }

  }

  const openShareDialog = async () => {
    if(!(await Sharing.isAvailableAsync())) {
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  }


  return ( 
    <View style = {styles.container}>
      <Text style = {styles.title} > Pick an Image!! </Text>
      <TouchableOpacity
        onPress={openImagePickerAsync}
      >
      <Image source = {
        {
          uri: 
            selectedImage !== null
            ? selectedImage.localUri 
            : 'https://i.picsum.photos/id/188/200/200.jpg?hmac=TipFoTVq-8WOmIswCmTNEcphuYngcdkCBi4YR7Hv6Cw',
        }
      }
        style={styles.image}
      />
      </TouchableOpacity> 
      {
        selectedImage ? 
        <TouchableOpacity
        onPress={openShareDialog} 
        style={styles.button}
      >
        <Text style={styles.buttonText}>Share this image</Text>
      </TouchableOpacity> 
      : <View/>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292929',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize:30, color: '#fff'},
  image: {width: 200, height: 200, borderRadius: 100, resizeMode: 'contain'},
  button: {
    backgroundColor: 'blue',
    padding: 7,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  }
});