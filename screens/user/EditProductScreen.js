import React, {useEffect, useCallback, useReducer} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TextInput, View, Alert} from 'react-native';
import {useSelector, useDispatch} from "react-redux";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import * as productsActions from "./../../store/actions/product";

const FORM_INPUT_UPDATE = 'UPDATE'

const formReducer = (state, action) => {
  if(action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues, //9.192 - copies all keyValuePairs
      [action.inputId]: action.value //9.192 - from textChangeHandler > dispatchFormState
    };
    const updatedValidities = {
      ...state.inputValues,
      [action.inputId]: action.isValid
    };
    let updatedFormIsValid = true;
    for(const key in updatedValidities) {
      //9.192 - js that sets formIsValid to false and stops if any of the values are false after the &&
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    };

    return {
      ...state,
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities
    };
  }

  return state;
}

const EditProductScreen = props => {
  const prodId = props.navigation.getParam('productId');
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(
    formReducer,
    {
      inputValues: {
        title: editedProduct ? editedProduct.title : '',
        imageUrl: editedProduct ? editedProduct.imageUrl : '',
        description: editedProduct ? editedProduct.description : '',
        price: ''
      },
      inputValidities: {
        title: !!editedProduct, //9.191 - same as editedProduct ? true : false
        imageUrl: !!editedProduct,
        description: !!editedProduct,
        price: !!editedProduct,
      },
      formIsValid: !!editedProduct
    }
  );

  const submitHandler = useCallback(() => {
    if(!formState.formIsValid){
      Alert.alert('Wrong Input', 'Please check the errors in the form', [
        {text: "Okay"}
      ])
      return;
    }

    if (editedProduct) {
      dispatch(productsActions.updateProduct(
        prodId,
        formState.inputValues.title,
        formState.inputValues.imageUrl,
        formState.inputValues.description))
    } else {
      //8.184 - adding a (+)on price converts it to a number
      dispatch(productsActions.createProduct(
        formState.inputValues.title,
        formState.inputValues.imageUrl,
        formState.inputValues.description,
        +formState.inputValues.price))
    }

    props.navigation.goBack();
  }, [dispatch, prodId, formState]);
  //9.192 - updated to formState - validity is updated for every keystroke and so should this handler

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const textChangeHandler = (inputIdentifier, text) => {
    let isValid = false;
    if(text.trim().length > 0){
      isValid = true
    }
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isValid,
      //inputId: 'title' //9.191 - connects to the property in the reducer above (inputValues)
      inputId: inputIdentifier //9.192
    });
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.title}
            onChangeText={textChangeHandler.bind(this, 'title')}
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType='next'
          />
          {!formState.inputValidities.title && <Text>Please enter a valid title!</Text>}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.imageUrl}
            onChangeText={textChangeHandler.bind(this, 'imageUrl')}
          />
        </View>
        {/*8.182 - Price is not editable  */}
        {editedProduct ? null : <View style={styles.formControl}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.price}
            onChangeText={textChangeHandler.bind(this, 'price')}
            keyboardType='decimal-pad'
          />
        </View>}
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.description}
            onChangeText={textChangeHandler.bind(this, 'description')}
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