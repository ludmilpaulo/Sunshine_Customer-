import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
//import { foods } from '../data/foodsData'
import tailwind from 'tailwind-react-native-classnames';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, updateBusket } from '../redux/slices/basketSlice';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import colors from '../configs/colors';

const MenuItems = ({ resId, foods, resName, resImage }) => {

    const [qty, setQty] = useState(1);
    const [restaurantId, setRestaurantId] = useState(resId);
    const cartItems = useSelector(selectCartItems)
    const dispatch = useDispatch()


    function quantityUp() {
        setQty(qty + 1);
    }

    function quantityDown() {
        if (qty != 1) {
          setQty(qty - 1)
        }
    }


    const match = id => {
        const resIndex = cartItems.findIndex(item => item.resName === resName)
        if (resIndex >= 0) {
            const menuIndex = cartItems[resIndex].foods.findIndex(item => item.id === id)
            if (menuIndex >= 0) return true
            return false
        } return false
    }

    const handleAddRemove = (id) => {
        const indexFromFood = foods.findIndex(x => x.id === id)
        const resIndex = cartItems.findIndex(item => item.resName === resName)
        const foodItem = foods[indexFromFood]

        if (resIndex >= 0) {
            const menuIndex = cartItems[resIndex].foods.findIndex(item => item.id === id)
            if (menuIndex >= 0) {
                let oldArrays = [...cartItems]
                let oldfoods = [...oldArrays[resIndex].foods]
                oldfoods.splice(menuIndex, 1)
                oldArrays.splice(resIndex, 1)
                let newArray = [...oldArrays, { foods: oldfoods, resName, resImage, resId }]
                dispatch(updateBusket(newArray))
            } else {
                let oldArrays = [...cartItems]
                let newFoodArray = [...oldArrays[resIndex].foods, foodItem]
                oldArrays.splice(resIndex, 1)
                let updatedResArray = [...oldArrays, { foods: newFoodArray, resName, resImage, resId }]
                dispatch(updateBusket(updatedResArray))
            }
        } else {
            let oldArrays = [...cartItems]
            let newResFoodArray = [...oldArrays, {
                foods: [{ ...foodItem }],
                resName,
                resImage,
                resId
            }]
            dispatch(updateBusket(newResFoodArray))
        }
    }

    return (
        <View style={tailwind`mt-5 mb-12`}>
            {foods?.map(({ name, short_description, quantity, image, price, id }, index) => (
                <View style={tailwind`mb-3 flex-row justify-between items-center pb-3 border-b border-gray-100`} key={index} >
                    <View style={tailwind`flex-1 pr-3 flex-row items-center`}>
                        {match(id) ? (
                            <BouncyCheckbox fillColor={colors.black} isChecked={true} onPress={() => handleAddRemove(id)} />
                        ) : (
                            <BouncyCheckbox fillColor={colors.black} isChecked={false} onPress={() => handleAddRemove(id)} />
                        )}
                        <View style={tailwind`flex-1 pl-2`}>
                            <Text style={[tailwind`text-gray-900 font-bold mb-1`, { fontSize: 16 }]}>{name}</Text>
                            <Text style={tailwind`text-gray-800 text-xs`}>{price},Kz</Text>
                            <Text style={tailwind`text-gray-600 text-xs`}>{short_description}</Text>
                        </View>

                       {/*/*  <View
                          style={{
                            borderRadius: 5,
                            borderWidth: 2,
                            borderColor: colors.gray,
                            width: 96,
                            height: 35,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            style={{
                              width: 32,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={quantityDown}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>-</Text>
                          </TouchableOpacity>
                          <Text style={{ fontSize: 16, fontWeight: 'bold' }}
                          onChangeText={(text) => quantity(text)}
                          >{qty}</Text>
                          <TouchableOpacity
                            style={{
                              width: 32,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onPress={quantityUp}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>+</Text>
                          </TouchableOpacity>
                        </View>*/}



                    </View>
                    <View style={tailwind``} >
                        <Image style={tailwind`h-16 w-16 rounded-lg`} source={{ uri: image }} />
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({})

export default MenuItems;
