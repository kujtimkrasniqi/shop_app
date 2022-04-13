import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
//createSwitchNavigator always displays exactly one screen and u cant go back to another screen if u then navigate to a different one
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { Platform, SafeAreaView, Button, View, Text } from 'react-native';

import colors from '../constants/colors';
import ProductsOverviewScreen from '../screens/shop/ProductOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import { Ionicons } from '@expo/vector-icons';
import UserProductScreen from '../screens/user/UserProductScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';

import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';

const defaultNavOption = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? colors.primary : ''
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : colors.primary
};

const ProductsNavigator = createStackNavigator({
    //first screen that i want to map in navigate is ProducstOverview
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                size={23}
                color={drawerConfig.tintColor}>
            </Ionicons>
        )
    },
    defaultNavigationOptions: defaultNavOption
});

//We will put OrdersScreen as SideMenu
const OrdersNavigator = createStackNavigator({
    Orders: OrdersScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                size={23}
                color={drawerConfig.tintColor}>
            </Ionicons>
        )
    },
    defaultNavigationOptions: defaultNavOption
});

const AdminNavigator = createStackNavigator({
    UserProducts: UserProductScreen,
    EditProduct: EditProductScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                size={23}
                color={drawerConfig.tintColor}>
            </Ionicons>
        )
    },
    defaultNavigationOptions: defaultNavOption
});

//Here we will merge two stacks ProductsNavigator that have 3 screens, and OrdersNavigator that have 1 screen
//here is side menu
const ShopNavigator = createDrawerNavigator({
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator
}, {
    contentOptions: {
        activeTintColor: colors.primary
    },
    //this allows to add an own component on side drawer instead of default
    contentComponent: props => {
        const dispatch = useDispatch();

        return (
            <View style={{flex: 1, paddingTop: 20}}>
                <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                    <DrawerNavigatorItems {...props}>

                    </DrawerNavigatorItems>
                    <Button title='Logout' color={colors.primary} onPress={() => {
                        dispatch(authActions.logout());
                        // props.navigation.navigate('Auth');
                    }}></Button>
                </SafeAreaView>
            </View>
        )
    }
});

//to have a nice header we will create AuthNavigator
const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
}, {
    defaultNavigationOptions: defaultNavOption
});

//AUTHENTICATION
const MainNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator
});

export default createAppContainer(MainNavigator);