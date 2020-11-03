import React from 'react';
import {useSelector} from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import ShopNavigator from "./ShopNavigator";
import ProductOverviewScreen from "../screens/shop/ProductOverviewScreen";

const MyStack = createStackNavigator(); //15.283 - A property that is now a component

const AppNavigator = props => {
  const isAuth = useSelector(state => !!state.auth.token);

  return <NavigationContainer>
    <MyStack.Navigator>
      <MyStack.Screen name="ProductsOverview" component={ProductOverviewScreen} />
    </MyStack.Navigator>
  </NavigationContainer>
}

export default AppNavigator;