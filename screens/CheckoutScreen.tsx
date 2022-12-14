import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Image, TextInput, TouchableOpacity , Text, Platform, Alert} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import tailwind from 'tailwind-react-native-classnames';
import * as Device from 'expo-device';
import * as Location from 'expo-location';


import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, updateBusket } from '../redux/slices/basketSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from "../configs/colors";




const CheckoutScreen = ({ navigation }) => {


      const [location, setLocation] = useState({});
      const [errorMsg, setErrorMsg] = useState(null);
      const [userAddress, setUserAddress  ] = useState();

      
       const dispatch = useDispatch()
      
      const [longitude, setLongitude ] = useState(0);
      const [latitude, setLatitude ] = useState(0);

      const [loading, setLoading] = useState(true);
      const [loadingOrder, setLoadingOrder] = useState(false);

      const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
      const [displayCurrentAddress, setDisplayCurrentAddress] = useState('');

      const allCartItems = useSelector(selectCartItems)

    
      

      const initialRegion = {
                  latitude: latitude,                     
                  longitude: longitude, 
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }

     const initialCoordinate = {
                  latitude : latitude,                     
                  longitude: longitude, 
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
        setLongitude(location.coords.longitude);
        setLatitude(location.coords.latitude);
        setLocation(location);
      };


useEffect(() => {
  const timer = setInterval(() => userLocation(), 2000);
  return () => clearInterval(timer);
},[userLocation]);





const tags = Object.keys(allCartItems).reduce((result, key) => {
  return result.concat(allCartItems[key].foods);
}, [])

let newA = tags.map(({id, quantity})=>{
      return ({meal_id:id, quantity})
    })

let resId = allCartItems.map(({resId})=>{
      return (`${resId}`).toString()
    })
let restaurantId = resId.toString();  



  const onPressBuy = async () => {
   
    setLoading(true);

      // Success;
      completeOrder()
    
   
    setLoading(false);
  };

 
  
const completeOrder = async () => {
    const value = await AsyncStorage.getItem('authUser');
    const tokenData = JSON.parse(value || {});
    let tokenvalue = tokenData.token;

   // if (restaurantId == )

    if(userAddress == null){
       alert('Por favor Preencha o Endere??o de Entrega') 
                        
    }else{
       
    let response = await fetch('https://www.sunshinedeliver.com/api/customer/order/add/', {
      mode: 'no-cors',
      method: 'POST',
      headers: {
        'Accepet': 'applocation/json',
        'Content-Type': 'application/json'
      },
        body: JSON.stringify({
        access_token: tokenvalue,
        restaurant_id: restaurantId,
        address: userAddress,
        order_details: newA

        })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          alert(responseJson.status);
          alert(responseJson.error);
          console.log("Response", responseJson);
            setTimeout(() => {
              setLoadingOrder(false);
              dispatch(updateBusket([]))
              navigation.navigate("SuccessScreen");
            }, 1300)
          })
          .catch( error => {alert("Selecione Comida apenas de um restaurante")
             navigation.navigate("CartScreen");
            console.log(error)}
            );
        }
}


  

    const mapRef = useRef();

   

    return (
      <>
        <View style={[tailwind`bg-blue-300 relative `, { height: 250 }]}>
            <MapView
                provider = { PROVIDER_GOOGLE }
                region={initialRegion}
               // ref={mapRef}
                style={tailwind`h-full z-10`}
            >
               
                    <Marker
                        coordinate={initialCoordinate}
                        identifier="shop"
                        anchor={{ x: 0.5, y: 0.5 }}
                        title="Shop"
                    >
                        <Image source={require('../assets/images/shop.png')} style={{ height: 27, width: 27 }} />
                    </Marker>
              
            </MapView >              
        </View >

        
          
  <View style={styles.form}>

    <TextInput
            style={styles.input}
            placeholder="Adicione seu endere??o" 
            value={userAddress}
            onChangeText={(text) => setUserAddress(text)}
            autoCapitalize={'none'}
          />


      <TouchableOpacity style={styles.containerbot}      
         onPress={completeOrder}
          >  
              <Text style={styles.vamosJuntos}>FA??A SEU PEDIDO </Text>
           
          </TouchableOpacity>
          
         
        </View>

        </>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    justifyContent: 'center'
  },
  wrapper: {
    paddingHorizontal: 20,
  },
  logo: {
    height: 160,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 30,
  },
  wellcomeTo: {
    fontSize: 23,
    fontWeight: "700",
    color: colors.secondary,
    marginTop: 20,
    textAlign: "center",
  },
  brand: {
    fontSize: 23,
    color: colors.primary,
    textAlign: "center",
    fontWeight: "500",
  },
  form: {
    marginTop: 75,
  },
  join: {
    marginTop: 10,
    textAlign: "center",
    color: colors.black,
  },
  or: {
    color: colors.gray,
    textAlign: "center",
    marginVertical: 20,
  },
  containertest: {
    position: 'relative',
  },
  input: {
      borderColor: colors.medium,
      backgroundColor: colors.light,
      borderWidth: 1,
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderRadius: 10,
      marginTop: 15
  },
  inputError: {
      borderColor: colors.denger
  },
  icon: {
      position: 'absolute',
      right: 15,
      top: 32
  },
  button: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    marginVertical: 5,
    marginTop: 15
  },
  text: {
      color: colors.white,
      fontSize: 18,
      // textTransform: 'uppercase',
      fontWeight: '700'
  },

  containerbot: {
    backgroundColor: "rgba(0,74,173,1)",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    marginVertical: 5,
    marginTop: 25
  },
  containertext: {
    width: 159,
    height: 32
  },
  vamosJuntos: {
    color: colors.white,
    fontSize: 18,
    // textTransform: 'uppercase',
    fontWeight: '700'
  }

})

export default CheckoutScreen;
