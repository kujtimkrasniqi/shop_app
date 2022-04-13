import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import colors from "../../constants/colors";
import CartItem from "../../components/shop/CartItem";
import * as cartActions from '../../store/actions/cart';
import * as ordersAction from '../../store/actions/orders';
import Card from "../../components/UI/Card";

const CartScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const cartTotalAmount = useSelector(state => state.cart.totalAmount);

    const cartItems = useSelector(state => {
        //cartItems is comming as object so we need to transform it to array
        console.log(state.cart);
        const transformedCartItems = [];
        for (const key in state.cart.items) {
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            });
        }
        return transformedCartItems.sort((a, b) => a.productId > b.productId ? 1 : -1);
    });

    const dispatch = useDispatch();

    const sendOrderHandler = async () => {
        setIsLoading(true);
        //we need to pass cartItems and cartTotalAmount at addOrder function in actions/orders.js
        await dispatch(ordersAction.addOrder(cartItems, cartTotalAmount));
        setIsLoading(false);
    };

    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>Total:
                    <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
                </Text>
                {isLoading ? (
                    <ActivityIndicator size='small' color={colors.primary}></ActivityIndicator>
                ) : (
                    <Button color={colors.accent}
                        title="Order Now"
                        disabled={cartItems.length === 0}
                        onPress={sendOrderHandler}
                    // onPress={() => {
                    //     //we need to pass cartItems and cartTotalAmount at addOrder function in actions/orders.js
                    //     dispatch(ordersAction.addOrder(cartItems, cartTotalAmount));
                    // }}
                    >
                    </Button>
                )}

            </Card>
            {/* in flatlist we need data as array */}
            {/* in renderItem we are using component CartItem */}
            <FlatList data={cartItems}
                keyExtractor={item => item.productId}
                renderItem={itemData =>
                    //we need to pass params to CartItem components
                    <CartItem quantity={itemData.item.quantity}
                        title={itemData.item.productTitle}
                        amount={itemData.item.sum}
                        deletable
                        onRemove={() => {
                            dispatch(cartActions.removeFromCart(itemData.item.productId));
                        }}>
                    </CartItem>}>
            </FlatList>
        </View>
    );
};

CartScreen.navigationOptions = {
    headerTitle: 'Your Cart'
};

const styles = StyleSheet.create({
    screen: {
        margin: 20,
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
    },
    summaryText: {
        fontSize: 18,
    },
    amount: {
        color: colors.primary,
    }
});

export default CartScreen;