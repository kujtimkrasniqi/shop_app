import React, { useReducer, useEffect } from 'react';
import { Platform, View, StyleSheet, Text, TextInput } from 'react-native';

//we create action here
const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

const inputReducer = (state, action) => {
    switch (action.type) {
        case INPUT_CHANGE:
            return {
                ...state,
                //value is from useReducer that we are gonna update with action.value (value from dispatch)
                value: action.value,
                isValid: action.isValid
            };
        case INPUT_BLUR:
            return {
                ...state,
                touched: true
            }
        default:
            return state;
    }
};

const Input = props => {

    const [inputState, dispatch] = useReducer(inputReducer, {
        //check if value is set or not
        value: props.initialValue ? props.initialValue : '',
        //check if props is valid
        isValid: props.initiallyValid,
        //check if user type
        touched: false
    });

    //to avoid an infinit rendering loop we can us the object destructuring syntax and pull out 'onInputChange'
    const { onInputChange, id } = props;


    useEffect(() => {
        if (inputState.touched) {
            //onInputChange is a name up to u
            //onInputChange we will use at EditProductScreen
            onInputChange(id, inputState.value, inputState.isValid);
        }
        //other changes in props will not trigger this thats why we put in array [inputState, onInputChange] to avoid unnecessary triggers
    }, [inputState, onInputChange, id]);

    const textChangeHandler = text => {
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

        //we will dispatch an action
        dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid })
    };

    //lost focus that meand the user is done entering content for the moment
    const lostFocusHandler = () => {
        dispatch({ type: INPUT_BLUR });
    };

    return (
        <View style={styles.formControl}>
            {/* WE MAKE TEXT DYNAMIC */}
            <Text style={styles.label}>{props.label}</Text>
            <TextInput
                {...props}
                style={styles.input}
                value={inputState.value}
                onChangeText={textChangeHandler}
                onBlur={lostFocusHandler}
            >
            </TextInput>
            {/* CHECK IF TITLE IS NOT VALID */}
            {!inputState.isValid && inputState.touched &&
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{props.errorText}</Text>
                </View>
            }

        </View>
    );
};

const styles = StyleSheet.create({
    formControl: {
        width: '100%',
    },
    label: {
        marginVertical: 8,
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    errorContainer: {
        marginVertical: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 13
    }
});

export default Input;