import React, {useEffect} from 'react';
import {FlatList, Platform, Button, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ProductItem from "./../../components/shop/ProductItem";
import * as cartActions from './../../store/actions/cart';
import * as productActions from './../../store/actions/product';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from './../../components/UI/HeaderButton';
import Colors from "../../constants/Colors";

const ProductOverviewScreen = props => {
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productActions.fetchProducts());
  }, [dispatch]); //10.202 - dispatch is dependency so it runs only one time

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
      // product: itemData.item
    })
  }

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => selectItemHandler(itemData.item.id, itemData.item.title)}
        >
          <Button title="View Details" color={Colors.primary} onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)}/>
          <Button
            title="To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  )
};

ProductOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: "All Products",
    headerLeft: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title='Menu'
        iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
        onPress={() => {navData.navigation.toggleDrawer()}}
      />
    </HeaderButtons>,
    headerRight: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title='Cart'
        iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
        onPress={() => {navData.navigation.navigate('Cart')}}
      />
    </HeaderButtons>
  }
}

export default ProductOverviewScreen;