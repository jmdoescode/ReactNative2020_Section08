import React, {useState, useEffect, useCallback} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {useSelector, useDispatch} from "react-redux";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import * as productsActions from "./../../store/actions/product";

const EditProductScreen = props => {
  const prodId = props.navigation.getParam('productId');
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
  const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
  const [price, setPrice] = useState(''); //The price should not be changeable
  const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');

  const submitHandler = useCallback(() => {
    if (editedProduct) {
      dispatch(productsActions.updateProduct(prodId, title, imageUrl, description))
    } else {
      //8.184 - adding a (+)on price converts it to a number
      dispatch(productsActions.createProduct(title, imageUrl, description, +price))
    };

    props.navigation.goBack();
  }, [dispatch, prodId, title, description, imageUrl, price]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={text => setTitle(text)}
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType='next'
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={text => setImageUrl(text)}
          />
        </View>
        {/*8.182 - Price is not editable  */}
        {editedProduct ? null : <View style={styles.formControl}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={text => setPrice(text)}
            keyboardType='decimal-pad'
          />
        </View>}
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={text => setDescription(text)}
          />
        </View>
      </View>
    </ScrollView>
  )
};

EditProductScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');

  return {
    headerTitle: navData.navigation.getParam('productId')
      ? 'Edit Product'
      : 'AddProduct',
    headerRight: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title='Save'
        iconName={Platform.OS === 'android' ? 'md-save' : 'ios-save'}
        onPress={submitFn}
      />
    </HeaderButtons>
  }
}

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  formControl: {
    width: '100%'
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  }
});

export default EditProductScreen;