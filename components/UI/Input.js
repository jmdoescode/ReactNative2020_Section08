import React, {useReducer, useEffect} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {Text} from "react-native";

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

const inputReducer = (state, action) => {
  switch (action.type){
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true
      };
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(
    inputReducer,
    {
      value: props.initialValue ? props.initialValue : '',
      isValid: props.initiallyValid,
      touched: false
    }
  );

  //9.194 - to avoid infinite re-rendering. destructuring only the onInputChange will trigger the useEffect below
  //    instead of any other props triggering
  //    *add id as well to stop the infinite loop
  const { onInputChange, id } = props;

  useEffect(() => {
    //9.194 - This will be listened to by the parent
    if(inputState.touched) { //9.194 - only fires when input loses focus
      onInputChange(id, inputState.value, inputState.isValid)
    }
  }, [inputState, onInputChange, id]);

  const textChangeHandler = text => {
    //9.193 - emailRegex given from the course
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }

    dispatch({type: INPUT_CHANGE, value: text, isValid: isValid})
  };

  const lostFocusHandler = () => {
    dispatch({type: INPUT_BLUR});
  };

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props} //9.192 - forward the props
        style={styles.input}
        value={inputState.value}
        onChangeText={textChangeHandler}
        //9.194 - *** FIX: Was originally onBlur but updated to onChange
        //    bc onBlur does not fire before saving when you go from description (last input)
        //    to save button
        onChange={lostFocusHandler}
      />
      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    fontFamily: 'open-sans',
    color: 'red',
    fontSize: 12
  }
})

export default Input;