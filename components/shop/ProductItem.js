import React from "react";
import {View, Text, Image, StyleSheet, Button, Platform} from "react-native";
import {TouchableOpacity, TouchableNativeFeedback} from "react-native";

import Colors from "./../../constants/Colors";

const ProductItem = (props) => {
  let TouchableComp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.version >= 21) TouchableComp = TouchableNativeFeedback;

  return (
    <View style={styles.product}>
      <TouchableComp style={styles.touchable} onPress={props.onViewDetails} useForeground>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{uri: props.image}}/>
        </View>
        <View style={styles.details}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.price}>{props.price.toFixed(2)}</Text>
        </View>
        <View style={styles.actions}>
          <Button title="View Details" color={Colors.primary} onPress={props.onViewDetails}/>
          <Button title="To Cart" onPress={props.onAddToCart}/>
        </View>
      </TouchableComp>
    </View>
  );
};

const styles = StyleSheet.create({
  product: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
    margin: 20,
    height: 300,
    overflow: 'hidden'
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 18,
    marginVertical: 4,
  },
  price: {
    fontSize: 14,
    color: "#888",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  details: {
    alignItems: "center",
    height: "15%",
    padding: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "25%",
    padding: 20
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden'
  }
});

export default ProductItem;