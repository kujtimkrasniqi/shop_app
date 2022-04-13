import React, { useEffect, useState } from 'react';
import { FlatList, Text, Platform, Button, ScrollView, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import colors from '../../constants/colors';

import OrderItem from '../../components/shop/OrderItem';
import * as ordersAction from '../../store/actions/orders';

const OrdersScreen = props => {

    const [isLoading, setIsLoading] = useState(false);

    //state.orders will get from App.js => CombineReducers
    //state.orders (will go till Combine reducers), state.orders.orders will get data that stored in reducers/orders.js at initialState
    const orders = useSelector(state => state.orders.orders);

    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        dispatch(ordersAction.fetchOrders()).then(() => {
            setIsLoading(false);
        });
    }, [dispatch]);

    if(isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={colors.primary}>

                </ActivityIndicator>
            </View>
        );
    }

    if(orders.length === 0)
    {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>No order found, start ordering some products?</Text>
            </View>
        )
    }

    return (
        <FlatList data={orders}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                //here we show data from models/order.js
                <OrderItem
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                    items={itemData.item.items}>
                </OrderItem>
            )
            }>
        </FlatList>
    );
};

OrdersScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Menu'
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}>
                </Item>
            </HeaderButtons>
        ),
    }
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
 
export default OrdersScreen;