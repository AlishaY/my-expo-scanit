import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { Button, StyleSheet, Text, Image, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as jpeg from 'jpeg-js';
import ScanScreen from '../ScanScreen';

// import Translator, { TranslatorProvider, useTranslator } from 'react-native-translator';

class Home extends React.Component {
    state = {
        isTfReady: false,
        isModelReady: false,
        predictions: null,
        image: null
      }
    
      async componentDidMount() {
        await tf.ready()
        this.setState({
          isTfReady: true
        })
        this.model = await mobilenet.load()
        this.setState({ isModelReady: true })
    
        //Output in Expo console
        console.log(this.state.isTfReady)
        this.getPermissionAsync()
      }

      getPermissionAsync = async () => {
        if (Constants.platform.ios) {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!')
          }
        }
      }

      imageToTensor(rawImageData) {
        const TO_UINT8ARRAY = true
        const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
        // Drop the alpha channel info for mobilenet
        const buffer = new Uint8Array(width * height * 3)
        let offset = 0 // offset into original data
        for (let i = 0; i < buffer.length; i += 3) {
          buffer[i] = data[offset]
          buffer[i + 1] = data[offset + 1]
          buffer[i + 2] = data[offset + 2]
    
          offset += 4
        }
    
        return tf.tensor3d(buffer, [height, width, 3])
      }

      classifyImage = async () => {
        try {
          const imageAssetPath = Image.resolveAssetSource(this.state.image)
          const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
          const rawImageData = await response.arrayBuffer()
          const imageTensor = this.imageToTensor(rawImageData)
          const predictions = await this.model.classify(imageTensor)
          this.setState({ predictions })
          console.log(predictions)
        } catch (error) {
          console.log(error)
        }
      }

      selectImage = async () => {
        try {
          let response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3]
          })
      
          if (!response.canceled) {
            const source = { uri: response.uri }
            this.setState({ image: source })
            this.classifyImage()
          }
        } catch (error) {
          console.log(error)
        }
      }
      renderPrediction = prediction => {
        return (
          <Text key={prediction.className} style={styles.text}> {prediction.className} </Text> 
          )
      }
      // naviScreen = () => {
      //   const navigation = useNavigation();
      //   navigation.navigate('ScanScreen');
      // }
    
      render() {
        const { isTfReady, isModelReady, predictions, image } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        
        <View style={styles.loadingContainer}>
          
          <View style={styles.loadingModelContainer}>
              {(isTfReady && isModelReady) ? (
                 <Text style={styles.text}> APP IS READY FOR SCANNING! </Text>) : <ActivityIndicator size='small' />}
          </View>
        </View>

        <TouchableOpacity
          style={styles.imageWrapper}
          onPress={isModelReady ? this.selectImage : undefined}>
          {image && <Image source={image} style={styles.imageContainer} />}

          {isModelReady && !image && (
            <Text style={styles.transparentText}>Tap to choose image</Text>
          )}
        </TouchableOpacity>

        <View style={styles.predictionWrapper}>
          {isModelReady && image && (
            <Text style={styles.text}>
              Predictions: {predictions ? '' : 'Predicting...'}
            </Text>
          )}
          {isModelReady &&
            predictions &&
            predictions.map(p => this.renderPrediction(p))}
        </View>

        <View style={styles.bottom}>
          <Button style={styles.text} title='SAVE THIS IMAGE' ></Button>
        </View>

        <Button title='LIVE Scan Now' onPress={() => this.props.navigation.navigate('ScanScreen')}></Button>

      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: '#FEA233',
      alignItems: 'center'
    },
    loadingContainer: {
      marginTop: 80,
      justifyContent: 'center'
    },
    text: {
      color: 'black',
      fontSize: 16
    },
    loadingModelContainer: {
      flexDirection: 'row',
      marginTop: 10
    },
    imageWrapper: {
      width: 320,
      height: 320,
      padding: 10,
      borderColor: 'black',
      borderWidth: 5,
      // borderStyle: '',
      marginTop: 40,
      marginBottom: 10,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center'
    },
    imageContainer: {
      width: 290,
      height: 290,
      position: 'absolute',
      top: 10,
      left: 10,
      bottom: 10,
      right: 10
    },
    predictionWrapper: {
      height: 100,
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center'
    },
    transparentText: {
      color: 'grey',
      opacity: 0.7
    },
    footer: {
      marginTop: 40
    },
    bottom: {
      flexDirection: 'row'
    }
  })
  export default Home;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

