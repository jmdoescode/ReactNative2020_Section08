import React from 'react';
import {Text, FlatList, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";

const OrderScreen = props => {
  const orders = useSelector(state => state.orders);

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      renderItem={itemData => <Text>{itemData.item.totalAmount}</Text>}
    />
  )
};

OrderScreen.navigationOptions = navData => {
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

export default OrderScreen;