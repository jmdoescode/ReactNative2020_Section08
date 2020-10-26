import React, {useCallback, useReducer, useState, useEffect} from 'react';
import {View, Button, ScrollView, StyleSheet, KeyboardAvoidingView, Alert, ActivityIndicator} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useDispatch} from "react-redux";

import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import Card from "../../components/UI/Card";
import * as authActions from './../../store/actions/auth';


const FORM_INPUT_UPDATE = 'UPDATE'

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.inputId]: action.value
    };
    const updatedValidities = {
      ...state.inputValues,
      [action.inputId]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
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


const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(
    formReducer,
    {
      inputValues: {
        email: '',
        password: '',
      },
      inputValidities: {
        email: false,
        password: false,
      },
      formIsValid: false
    }
  );

  useEffect(() => {
    if(error) {
      Alert.alert('An error occurred!', error, [{text: 'Okay'}]);
    }
  }, [error])

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(formState.inputValues.email, formState.inputValues.password);
    } else {
      action = authActions.login(formState.inputValues.email, formState.inputValues.password);
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: inputValue,
      isValid: inputValidity,
      inputId: inputIdentifier
    });
  }, [dispatchFormState]);

  return <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={50} style={styles.screen}>
    <LinearGradient colors={['#006FF3', '#001227', '#001227']} style={styles.gradient}>
      <Card style={styles.authContainer}>
        <ScrollView>
          <Input
            id='email'
            label='E-Mail'
            keyboardType='email-address'
            required
            email
            autoCapitalize='none'
            errorText='Please enter a valid email address'
            onInputChange={inputChangeHandler}
            initialValue=''
          />
          <Input
            id='password'
            label='Password'
            keyboardType='default'
            secureTextEntry //necessary for password
            required
            minLength={5}
            autoCapitalize='none'
            errorText='Please enter a valid password'
            onInputChange={inputChangeHandler}
            initialValue=''
          />
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Button
                title={isSignup ? 'Sign Up' : 'Login'}
                color={Colors.primary}
                onPress={authHandler}
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
              color={Colors.accent}
              onPress={() =>
                setIsSignup(prevState => !prevState)
            }/>
          </View>
        </ScrollView>
      </Card>
    </LinearGradient>
  </KeyboardAvoidingView>
};

AuthScreen.navigationOptions = {
  headerTitle: 'Login'
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 500,
    padding: 30
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    margin: 10
  }
});

export default AuthScreen;