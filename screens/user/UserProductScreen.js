import React from 'react';
import {Alert, Button, FlatList, Platform} from 'react-native';
import {useSelector, useDispatch} from "react-redux";

import ProductItem from "../../components/shop/ProductItem";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import * as productsActions from "./../../store/actions/product";

const UserProductScreen = props => {
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  const editProductHandler = (id) => {
    props.navigation.navigate('EditProduct', {productId: id});
  };

  const deleteHandler = (id) => {
    Alert.alert(
      "Are you sure?",
      "Do you really want to delete this item?",
      [
        {text: 'No', style: 'default'},
        {text: 'Yes', style: 'destructive', onPress: () => {
            dispatch(productsActions.deleteProduct(id))
          }}
      ]
    );
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData =>
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProductHandler(itemData.item.id)
          }}
        >
          <Button title="Edit" color={Colors.primary} onPress={() => {
            editProductHandler(itemData.item.id)
          }} />
          <Button title="Delete" onPress={deleteHandler.bind(this, itemData.item.id)} />
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
    </HeaderButtons>,
    headerRight: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title='Add'
        iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
        //8.181 - Still navigating to the EditProduct screen
        //    BUT Not passing in any parameters (since it is a new product)
        //    Will do this in future sections
        onPress={() => {navData.navigation.navigate('EditProduct')}}
      />
    </HeaderButtons>
  }
}

export default UserProductScreen;