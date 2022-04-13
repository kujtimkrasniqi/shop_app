import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../constants/colors';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';

const StartupScreen = props => {
    const dispatch = useDispatch();

    useEffect(() => {
        const tryLogin = async () => {
            //we are getting data from AsyncStore, userData we used as key at auth.js
            const userData = await AsyncStorage.getItem('userData');
            if (!userData) {
                //if we dont have user token go to auth screen
                props.navigation.navigate('Auth');
                return;
            }
            
            const transformData = JSON.parse(userData);
            //token, userId, expiryDate we get from auth.js that we save at saveDataToStorage
            const {token, userId, expiryDate} = transformData;
            const expirationDate = new Date(expiryDate);

            //if token expired or we dont have token or we dont have user return to auth screen
            if(expirationDate <= new Date() || !token || !userId)
            {
                props.navigation.navigate('Auth');
                return;
            }

            //in milly seconds
            //so here we get expirationDate means future date (time when we login) - now()
            const expirationTime = expirationDate.getTime() - new Date().getTime();

            props.navigation.navigate('Shop');
            dispatch(authActions.authenticate(userId, token, expirationTime));
        };

        tryLogin();
    }, [dispatch]);

    return (
        <View style={styles.screen}>
            <ActivityIndicator size='large' color={colors.primary}></ActivityIndicator>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default StartupScreen;