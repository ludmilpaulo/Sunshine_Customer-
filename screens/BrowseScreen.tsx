import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { View, StyleSheet, Dimensions, Platform, Image, TouchableOpacity, Text } from 'react-native';
import Screen from '../components/Screen';
import tailwind from 'tailwind-react-native-classnames';

import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import * as Device from 'expo-device';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';




import PolylineDirection from '@react-native-maps/polyline-direction';

import AsyncStorage from '@react-native-async-storage/async-storage';


import colors from '../configs/colors';


const BrowseScreen = () => {

  const GOOGLE_MAPS_APIKEY = 'AIzaSyBBkDvVVuQBVSMOt8wQoc_7E-2bvDh2-nw';

  const [ driverLocation, setDriverLocation ] = useState();
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  const [userlongitude, setUserLongitude ] = useState(0);
  const [userlatitude, setUserLatitude ] = useState(0);

  const [ destination, setDestination ] = useState();

  const [driverLong, setDriverLong ] = useState(0);
  const [driverlat, setDriverLat ] = useState(0);



 /*const { latitudeDelta } = driverLocation;

 console.log('aqui', driverLocation);

*/
 


const covertDriverLocation = async () => { 


  const final = driverLocation.replace(/{|},|}/g, "\n").replace(/\[|\]|"/g, "").replace(/,/g, ',\n')

  let blah2 = driverLocation.replace(/[{}]/g, '');

  let q = driverLocation.replace(/['"]+/g, '').replace(/[{}]/g, '');

  let arr = q.split();

  //leg nums = arr

 
      
    
    console.log('PARSED VALUE =', arr);

   
   

    

}

useEffect(() => {
  const timer = setInterval(() => covertDriverLocation()

    , 2000);
  return () => clearInterval(timer);
},[covertDriverLocation]);







  const getDriverLocation = async () => {
   const value = await AsyncStorage.getItem('authUser');
    const tokenData = JSON.parse(value || {});
    let tokenvalue = tokenData.token;
    let userName = tokenData.username;
    setDestination(userName);

    let response = await fetch('https://www.sunshinedeliver.com/api/customer/driver/location/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: tokenvalue
          
          })
      })
      const locationData = await response.json();

      setDriverLocation(locationData?.location); 
}


  const initialRegion = {
    latitude: userlatitude,                     
    longitude: userlongitude, 
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  }

 const initialCoordinate = {
      latitude: -33.9284133,
      longitude: 18.4313642,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }
   


 const userLocation = async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLongitude(location.coords.longitude);
      setUserLatitude(location.coords.latitude);
      setLocation(location);
};

useEffect(() => {
  const timer = setInterval(() => getDriverLocation(), 2000);
  return () => clearInterval(timer);
},[getDriverLocation]);



useEffect(() => {
  const timer = setInterval(() => userLocation(), 2000);
  return () => clearInterval(timer);
},[userLocation]);
  


  return (
      <>
        <Screen style={tailwind`flex-1 bg-white`}>

    
        
          <View style={styles.container}>

              


           <MapView 
             provider = { PROVIDER_GOOGLE }
             region={initialCoordinate}
             style={styles.map} >

             <PolylineDirection
              origin={initialRegion}
              destination={initialCoordinate}
              apiKey={GOOGLE_MAPS_APIKEY}
              strokeWidth={4}
              strokeColor="#004AAD"
            />

            {initialRegion && (
                    <Marker
                        coordinate={{
                            ...initialRegion
                        }}
                        identifier="shop"
                        anchor={{ x: 0.5, y: 0.5 }}
                        title={destination}
                    >
                        <Image source={require('../assets/you-are-here.png')} style={{ height: 27, width: 27 }} />
                    </Marker>
                )}


             {initialCoordinate && (
                    <Marker
                        coordinate={{
                            ...initialCoordinate
                        }}
                        identifier="shop"
                        anchor={{ x: 0.5, y: 0.5 }}
                        title={destination}
                    >
                        <Image source={require('../assets/images/shop.png')} style={{ height: 27, width: 27 }} />
                    </Marker>
                )}

          </MapView>
           
 
         </View>
            
      </Screen>
    </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
    input: {
        borderColor: colors.medium,
        borderWidth: 1,
    },
    button: {
    top: 18,
    left: 6,
    position: "absolute",
    backgroundColor: "rgba(230,230,230,1)",
    right: 0,
    bottom: 0
  },
  rect: {
    width: 348,
    height: 48,
    backgroundColor: "rgba(0,74,173,1)",
    borderRadius: 100,
    marginTop: 725,
    marginLeft: 7
  },
  buttonStack: {
    backgroundColor: "rgba(0,74,173,1)",
    borderRadius: 100,
    width: 348,
    height: 48
  },
    text: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '700'
    },

})

export default BrowseScreen;
