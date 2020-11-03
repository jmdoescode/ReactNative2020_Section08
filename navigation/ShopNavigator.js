import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator, DrawerItemList} from '@react-navigation/drawer';

// import {createStackNavigator} from 'react-navigation-stack';
// import {createDrawerNavigator, DrawerNavigatorItems} from 'react-navigation-drawer';
// import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {Button, Platform, SafeAreaView, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useDispatch} from 'react-redux';

import Colors from '../constants/Colors';
import ProductOverviewScreen, {screenOptions as productOverviewScreenScreenOptions} from "../screens/shop/ProductOverviewScreen";
import ProductDetailScreen, {screenOptions as productDetailScreenScreenOptions} from "../screens/shop/ProductDetailScreen";
import CartScreen, {screenOptions as cartScreenScreenOptions} from "../screens/shop/CartScreen";
import OrderScreen, {orderScreenOptions} from "../screens/shop/OrderScreen";
import UserProductScreen, {userProductScreenOptions} from "../screens/user/UserProductScreen";
import EditProductScreen, {editProductScreenOptions} from "../screens/user/EditProductScreen";
import AuthScreen, {authScreenOptions} from "../screens/user/AuthScreen";
import * as authActions from './../store/actions/auth';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold"
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans"
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
}

const ProductsStackNavigator = createStackNavigator();

export const ProductsNavigator = () => {
  return <ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
    <ProductsStackNavigator.Screen
      name='ProductsOverview'
      component={ProductOverviewScreen}
      options={productOverviewScreenScreenOptions}
    />
    <ProductsStackNavigator.Screen
      name='ProductDetail'
      component={ProductDetailScreen}
      options={productDetailScreenScreenOptions}
    />
    <ProductsStackNavigator.Screen
      name='CartScreen'
      component={CartScreen}
      options={cartScreenScreenOptions}
    />
  </ProductsStackNavigator.Navigator>
}


const OrdersStackNavigator = createStackNavigator();

export const OrdersNavigator = () => {
  return <OrdersStackNavigator.Navigator screenOptions={defaultNavOptions}>
    <OrdersStackNavigator.Screen
      name="Orders"
      component={OrderScreen}
      options={orderScreenOptions}
    />
  </OrdersStackNavigator.Navigator>
}


const AdminStackNavigator = createStackNavigator();

export const AdminNavigator = () => {
  return <AdminStackNavigator.Navigator>
    <AdminStackNavigator.Screen
      name="UserProducts"
      component={UserProductScreen}
      options={userProductScreenOptions}
    />
    <AdminStackNavigator.Screen
      name="EditProduct"
      component={EditProductScreen}
      options={editProductScreenOptions}
    />
  </AdminStackNavigator.Navigator>
}


const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
  const dispatch = useDispatch();

  return (
    <ShopDrawerNavigator.Navigator
      drawerContentOptions={{
        activeTintColor: Colors.primary
      }}
      drawerContent={props => {
        return <View style={{flex: 1, paddingTop: 20}}>
          <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
            <DrawerItemList {...props} />
            <Button title='Logout' color={Colors.primary} onPress={() => {
              dispatch(authActions.logout());
              //props.navigation.navigate('Auth');
            }}/>
          </SafeAreaView>
        </View>
      }}
    >
      <ShopDrawerNavigator.Screen
        name="Products"
        component={ProductsNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Admin"
        component={AdminNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
    </ShopDrawerNavigator.Navigator>
  )
}


const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
    <AuthStackNavigator.Screen
      name="Auth"
      component={AuthScreen}
      options={authScreenOptions}
    />
  </AuthStackNavigator.Navigator>
}


// const ProductsNavigator = createStackNavigator(
//   {
//     ProductsOverview: ProductOverviewScreen,
//     ProductDetail: ProductDetailScreen,
//     Cart: CartScreen
//   },
//   {
//     navigationOptions: {
//       drawerIcon: drawerConfig => (
//         <Ionicons
//           name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       )
//     },
//     defaultNavigationOptions: defaultNavOptions
//   }
// );
//
// const OrdersNavigator = createStackNavigator(
//   {
//     Orders: OrderScreen,
//   },
//   {
//     navigationOptions: {
//       drawerIcon: drawerConfig => (
//         <Ionicons
//           name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       )
//     },
//     defaultNavigationOptions: defaultNavOptions
//   }
// );
//
// const AdminNavigator = createStackNavigator(
//   {
//     UserProducts: UserProductScreen,
//     EditProduct: EditProductScreen
//   },
//   {
//     navigationOptions: {
//       drawerIcon: drawerConfig => (
//         <Ionicons
//           name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       )
//     },
//     defaultNavigationOptions: defaultNavOptions
//   }
// );
//
// const ShopNavigator = createDrawerNavigator(
//   {
//     Products: ProductsNavigator,
//     Orders: OrdersNavigator,
//     Admin: AdminNavigator
//   },
//   {
//     contentOptions: {
//       activeTintColor: Colors.primary
//     },
//     //11.223 - reminder that this can be created outside of the ShopNavigator and imported in
//     contentComponent: props => {
//       const dispatch = useDispatch();
//       return <View style={{flex:1, paddingTop: 20}}>
//         <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
//           <DrawerNavigatorItems {...props} />
//           <Button title='Logout' color={Colors.primary} onPress={() => {
//             dispatch(authActions.logout());
//             props.navigation.navigate('Auth');
//           }} />
//         </SafeAreaView>
//       </View>
//     }
//   }
// );
//
// const AuthNavigator = createStackNavigator({
//   Auth: AuthScreen
// }, {
//   defaultNavigationOptions: defaultNavOptions
// });
//
// const MainNavigator = createSwitchNavigator({
//   Startup: StartupScreen,
//   Auth: AuthNavigator,
//   Shop: ShopNavigator
// });

// export default createAppContainer(MainNavigator);