import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import * as productsActions from "./../../store/actions/product";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";

const FORM_INPUT_UPDATE = 'UPDATE'

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues, //9.192 - copies all keyValuePairs
      [action.inputId]: action.value //9.192 - from textChangeHandler > dispatchFormState
    };
    const updatedValidities = {
      ...state.inputValues,
      [action.inputId]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      //9.192 - js that sets formIsValid to false and stops if any of the values are false after the &&
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

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
        price: editedProduct ? editedProduct.price : '',
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

  useEffect(() => {
    if(error) {
      Alert.alert('An Error occured', error, [
        {text: 'Okay'}
      ]);
    }
  }, [error])

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong Input', 'Please check the errors in the form', [
        {text: "Okay"}
      ]);
      return;
    }

    setError(false);
    setIsLoading(true);

    try{
      if (editedProduct) {
        await dispatch(productsActions.updateProduct(
          prodId,
          formState.inputValues.title,
          formState.inputValues.imageUrl,
          formState.inputValues.description))
      } else {
        //8.184 - adding a (+)on price converts it to a number
        await dispatch(productsActions.createProduct(
          formState.inputValues.title,
          formState.inputValues.imageUrl,
          formState.inputValues.description,
          +formState.inputValues.price))
      }

      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, prodId, formState]);
  //9.192 - updated to formState - validity is updated for every keystroke and so should this handler

  useEffect(() => {
    props.navigation.setParams({submit: submitHandler});
  }, [submitHandler]);

  //9.194 - renamed from textChangeHandler to be more fitting
  //    *wrapped in UseCallback so the function isn't rebuilt unnecessarily
  const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: inputValue,
      isValid: inputValidity,
      //inputId: 'title' //9.191 - connects to the property in the reducer above (inputValues)
      inputId: inputIdentifier //9.192
    });
  }, [dispatchFormState]); //9.194 - should never be rebuilt bc the logic never changes


  if(isLoading) {
    return <View style={styles.centered}>
      <ActivityIndicator size='large' color={Colors.primary} />
    </View>
  }

  return (
    //9.195 - IMPORTANT: Don't forget the {FLEX : 1} otherwise it will not take up the whole screen
    <KeyboardAvoidingView style={{flex: 1}} behavior="padding" keyboardVerticalOffset={100}>
      <ScrollView>
        <View style={styles.form}>
          <Input
            label="Title"
            errorText="Please enter a valid title"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType='next'
            id="title"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.title : ''}
            initiallyValid={!!editedProduct}
            required
          />
          <Input
            label="Image Url"
            errorText="Please enter a valid image url"
            returnKeyType='next'
            id="imageUrl"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageUrl : ''}
            initiallyValid={!!editedProduct}
            required
          />
          {/*8.182 - Price is not editable  */}
          {editedProduct ? null : (
            <Input
              label="Price"
              errorText="Please enter a valid price"
              keyboardType='decimal-pad'
              returnKeyType='next'
              id="price"
              onInputChange={inputChangeHandler}
              //9.194 - will never have initial value and will never be intially valid
              required
              min={0.1}
            />
          )}
          <Input
            label="Description"
            errorText="Please enter a valid description"
            autoCapitalize="sentences"
            autocorrect
            multiline
            numberOfLines={3}
            id="description"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.description : ''}
            initiallyValid={!!editedProduct}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
};

export const editProductScreenOptions = navData => {
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EditProductScreen;