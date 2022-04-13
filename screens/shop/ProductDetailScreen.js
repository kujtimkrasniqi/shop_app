import React from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../constants/colors';
import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = props => {
    //here we get productId param that we pass on navigation at ProductOverviewScreen
    const productId = props.navigation.getParam('productId');
    //state.products => we get products from app.js from combineReducers
    const selectedProduct = useSelector(state => state.products.availableProducts.find(prod => prod.id === productId));
    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }}></Image>
            <View style={styles.actions}>
                <Button color={colors.primary} title='Add to Cart' onPress={() => {
                    dispatch(cartActions.addToCart(selectedProduct));
                 }}></Button>
            </View>
            <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>
        </ScrollView>
    );
};

ProductDetailScreen.navigationOptions = navData => {
    return {
        //we get productTitle param from ProductOverviewScreen that we pass there
        headerTitle: navData.navigation.getParam('productTitle')
    }
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    actions: {
        marginVertical: 10,
        alignItems: 'center',
    },  
    price: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 12
    }
});

export default ProductDetailScreen;