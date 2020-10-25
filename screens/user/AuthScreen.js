import React from 'react';
import {View, Button, ScrollView, StyleSheet, KeyboardAvoidingView} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import Card from "../../components/UI/Card";

const AuthScreen = props => {
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
            errorMessage='Please enter a valid email address'
            onValueChange={() => {
            }}
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
            errorMessage='Please enter a valid password'
            onValueChange={() => {
            }}
            initialValue=''
          />
          <View style={styles.buttonContainer}>
            <Button title='Login' color={Colors.primary} onPress={() => {}}/>
          </View>
          <View style={styles.buttonContainer}>
            <Button title='Switch to Sign Up' color={Colors.accent} onPress={() => {}}/>
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