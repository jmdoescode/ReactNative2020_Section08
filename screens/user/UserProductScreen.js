import React from 'react';
import {Button, FlatList, Platform} from 'react-native';
import {useSelector, useDispatch} from "react-redux";

import ProductItem from "../../components/shop/ProductItem";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import * as productsActions from "./../../store/actions/product";

const UserProductScreen = props => {
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  return (
    <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData =>
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {}}
        >
          <Button title="Edit" color={Colors.primary} onPress={() => {}} />
          <Button title="Delete" onPress={() => {
            dispatch(productsActions.deleteProduct(itemData.item.id))
          }} />
        </ProductItem>
      }
    />
  );
};

UserProductScreen.navigationOptions  = navData => {
  return {
    headerTitle: 'Your Products',
    headerLeft: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title='Menu'
        iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
        onPress={() => {
          navData.navigation.toggleDrawer()
        }}
      />
    </HeaderButtons>
  }
}

export default UserProductScreen;