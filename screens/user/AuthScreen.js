import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import colors from '../../constants/colors';

import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

//we will create formReducer to merge all useStates in one place
const formReducer = (state, action) => {
    //action.type => u can name it how ever u want
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            //we are copying all key-value of that input values snapshot than we want to replace the key value pair for the input which the action was dispatched
            ...state.inputValues,
            //.input we call from dispatchFormState and value is: e.g title, imageUrl, price, description
            [action.input]: action.value
        };

        const updatedValidities = {
            ...state.inputValidities,
            //.isValid we call from dispatchFormState and replace this with action is valid
            [action.input]: action.isValid
        };

        //now we need to manage overall from validity, for that loop all updatedValidities
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }

        return {
            //all of those 3 valuse: formIsValid, inputValidites, inputValues are declared at useReducer down
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        };
    }
    return state;
};

const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignup, setIsSignup] = useState(false);

    const dispatch = useDispatch();

    //useReducer, this si initial state that we pass here and thats the state which later want to change from inside function formReducer
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    useEffect(() => {
        if(error)
        {
            Alert.alert('An Error Occurred', error, [{text: 'Okay'}])
        }
    }, [error]);

    const authHandler = async () => {
        //check if is in signup mode or login mode
        let action;
        if (isSignup) {
            action = authActions.signup(formState.inputValues.email, formState.inputValues.password);
        }
        else {
            action = authActions.login(formState.inputValues.email, formState.inputValues.password);
        }

        setError(null);
        setIsLoading(true);

        try{
            await dispatch(action);
            props.navigation.navigate('Shop');
        }
        catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    return (
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={50} style={styles.screen}>
            <LinearGradient colors={['#ffedff', '#aeaeb1']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-Mail"
                            keyboardType="email-address"
                            required
                            email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address."
                            onInputChange={inputChangeHandler}
                            initialValue=''>
                        </Input>

                        <Input
                            id="password"
                            label="Password"
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorText="Please enter a valid password."
                            onInputChange={inputChangeHandler}
                            initialValue=''>
                        </Input>
                        <View style={styles.buttonContainer}>
                            {isLoading ? (
                                <ActivityIndicator size='small' color={colors.primary}></ActivityIndicator>
                            ) : (
                                <Button
                                    title={isSignup ? 'Sign Up' : 'Login'}
                                    color={colors.primary}
                                    onPress={authHandler}>
                                </Button>
                            )}

                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                                color={colors.accent}
                                onPress={() => {
                                    setIsSignup(prevState => !prevState);
                                }}>
                            </Button>
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: 10,
    }
});

export default AuthScreen;

