import React from 'react';
import {ScrollView, View, Text, Image, Button, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

const ProductDetailScreen = props => {
  const selectedProduct = useSelector(state => state.products.availableProducts.find(
    prod => prod.id === props.navigation.getParam("productId")
  ));

  return (
    <ScrollView>
      <Text>{selectedProduct.title}</Text>
    </ScrollView>
  )
}

ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam("productTitle")
  }
}

const styles = StyleSheet.create({});

export default ProductDetailScreen;