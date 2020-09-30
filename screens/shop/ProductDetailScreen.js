import React from 'react';
import {ScrollView, View, Text, Image, Button, StyleSheet} from 'react-native';

const ProductDetailScreen = props => {
  return (
    <Text>test</Text>
  )
}

ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam("productTitle")
  }
}

const styles = StyleSheet.create({});

export default ProductDetailScreen;