import React from 'react';
import {ScrollView, View, Text, Image, Button, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Colors from "../../constants/Colors";
import * as cartActions from './../../store/actions/cart';

const ProductDetailScreen = props => {
  const selectedProduct = useSelector(state => state.products.availableProducts.find(
    prod => prod.id === props.navigation.getParam("productId")
  ));
  const dispatch = useDispatch();

  return (
    <ScrollView>
      <Image style={styles.image} source={{uri: selectedProduct.imageUrl}} />
      <View style={styles.actions}>
        <Button color={Colors.primary} title="Add to Cart" onPress={() => {
          dispatch(cartActions.addToCart(selectedProduct))
        }} />
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  )
}

export const screenOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam("productTitle")
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300
  },
  price: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: "open-sans-bold"
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
    fontFamily: "open-sans"
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center' //8.167 - makes button centered without taking entire width
  }
})

export default ProductDetailScreen;