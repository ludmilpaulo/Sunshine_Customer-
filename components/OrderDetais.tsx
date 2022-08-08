import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity } from 'react-native';

import tailwind from 'tailwind-react-native-classnames';
import MaterialCardWithImageAndTitle from "./MaterialCardWithImageAndTitle";

import BouncyCheckbox from "react-native-bouncy-checkbox";
import colors from '../configs/colors';
import AppHead from '../components/AppHead';
import AppButton from '../components/AppButton'


import { useNavigation } from "@react-navigation/native";

const OrderDetais = ({ data, client, order, resData }) => {

    const navigation = useNavigation();

     const url = 'https://www.sunshinedeliver.com';

    const customer_name  = `${client.name}`;
    const customer_avatar  = `${client.avatar}`;
    const customer_image = `${url}${customer_avatar}`;
    const customer_phone  = `${client.phone}`;
    const customer_address  = `${client.address}`;

    const restaurant_name  = `${resData.name}`;
    const restaurant_phone  = `${resData.phone}`;
    const restaurant_address  = `${resData.address}`;

   

    const tags = Object.keys(order).reduce((result, key) => {
      return result.concat(order[key].meal);
    }, [])

    let newA = tags.map(({name})=>{
      return (`${name}`).toString()
    })
    let order_name = newA.toString();

     let p = tags.map(({price})=>{
      return (`${price}`).toString()
    })
    let order_price = p.toString();  

    const order_address = `${data.address}`;
    const order_quantity = `${order.quantity}`;
    const order_sub_total = `${order.sub_total}`;
    const order_id = `${data.id}`;
    const order_status = `${data.status}`;
    const order_total = `${data.total}`;




   

    return (
 <>
        <ScrollView style={tailwind`mx-4 mt-3`} showsVerticalScrollIndicator={false}>

         

        
                <View  style={tailwind`mb-4`}>
                    <View style={tailwind`mb-4 relative justify-center`}>
                        <Image style={tailwind`w-full h-16 rounded-lg`} source={{ uri: customer_image }} />
                        <View style={[tailwind`absolute top-0 left-0 w-full h-full bg-black rounded-lg`, { opacity: 0.5 }]} />
                        <Text style={tailwind`absolute self-center text-white w-3/4 text-center font-bold text-xl`} numberOfLines={1}>{restaurant_name}</Text>
                    </View>
                   
                        <View style={tailwind`mb-3 flex-row justify-between items-center pb-3 border-b border-gray-100`}  >
                            <View style={tailwind`flex-1 pr-3 flex-row items-center`}>
                             
                                    <BouncyCheckbox fillColor={colors.black} isChecked={true}  />
                             
                                  
                             
                                <View style={tailwind`flex-1 pl-2`}>
                                    <Text style={[tailwind`text-gray-900 font-bold mb-1`, { fontSize: 16 }]}>{order_name}</Text>
                                    <Text style={tailwind`text-gray-800 text-xs`}>{order_price} Kz</Text>
                                    <Text style={tailwind`text-gray-600 text-xs`}>{order_address}</Text>
                                </View>
                            </View>
                            <View style={tailwind``} >
                                <Image style={tailwind`h-16 w-16 rounded-lg`} source={{ uri: customer_image }} />
                            </View>
                        </View>
               
                </View>
          
        </ScrollView>
         <View style={tailwind`flex-row items-center px-5 pb-5`}>
            <View style={styles.left}>
                <Text style={styles.total}>Motorista: {customer_name}{'\n'}</Text>
                <Text style={styles.totalAmount}>Telefone: {customer_phone}</Text>
            </View>
        </View>

              <Text style={{
              width: '100%',
              borderTopWidth: 0,
              borderRadius: 100,
              paddingTop: 1,
               paddingBottom: 15,
               height: 50,
                backgroundColor: "rgba(0,74,173,1)",
                color: colors.white,
                fontSize: 28,
                textAlign: "center",
            }}>{order_status}</Text>
      
         


    </>
    );
}

const styles = StyleSheet.create({
    left: {
        marginRight: 20,
        marginTop: -100
    },
    right: {
        flex: 1,
        width: '100%'
    },
    total: {
        fontSize: 14,
        color: colors.title
    },
    totalAmount: {
        fontSize: 23,
    },
    materialCardWithImageAndTitle: {
    height: 166,
    width: 375,
    borderRadius: 100,
    marginTop: 576
  }
})

export default OrderDetais;
