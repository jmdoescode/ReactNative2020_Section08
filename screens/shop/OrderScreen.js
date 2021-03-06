import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Platform, ActivityIndicator, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import * as ordersActions from './../../store/actions/order'
import Colors from "../../constants/Colors";

const OrderScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(ordersActions.fetchOrders()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  if(isLoading){
    return <View>
      <ActivityIndicator size='large' Color={Colors.primary} style={styles.centered} />
    </View>
  }

  if(orders.length === 0){
    return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>No orders found.</Text>
    </View>
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      renderItem={itemData =>
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />}
    />
  )
};

export const orderScreenOptions = navData => {
  return {
    headerTitle: "Your Orders",
    headerLeft: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title='Menu'
        iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
        onPress={() => {navData.navigation.toggleDrawer()}}
      />
    </HeaderButtons>
  }
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default OrderScreen;