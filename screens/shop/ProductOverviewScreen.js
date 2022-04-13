import React, { useState, useEffect, useCallback } from 'react';
//ActivityIndicator for spinner
import { FlatList, Text, Button, Platform, ActivityIndicator , View, StyleSheet} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import colors from '../../constants/colors';
import * as productsActions from '../../store/actions/product';

const ProductsOverviewScreen = props => {
    //we will create isLoading to check if there is a data to load or not
    const [isLoading, setIsLoading] = useState(false);
    //handle and show error message
    const [error, setError] = useState();
    //to refresh the page
    const [isRefreshing, setIsRefreshing] = useState(false);
    // get data with redux
    //state.products => we get products from app.js from combineReducers
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    //we use useCallback to avoid multiple rendering
    const loadProducts = useCallback(async () => {
        console.log('LOAD PRODUCTS');
        setError(null);
        setIsRefreshing(true);
        // setIsLoading(true);
        //await we use to wait for dispatching to be done, after its done we set setIsLoading to false, means that we dont have any more  data to load
        try{
            await dispatch(productsActions.fetchProducts());
        }
        catch(err)
        {
            setError(err.message);
        }
        setIsRefreshing(false);
        // setIsLoading(false);
    }, [dispatch, setIsLoading, setError]); 

    //we will use this always to fetch updated data, even if we make directly in server any change on data it will get last updated
    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts);

        //clean up function
        return () => {
             willFocusSub.remove();
        };
    }, [loadProducts]);

    // fetch data from actions/product.js
    useEffect(() => {
        setIsLoading(true);
        //check if there is a data to load or not
        loadProducts().then(() => {
            setIsLoading(false);
        });

        //now we have as dependices dispatch and loadProducts
    }, [dispatch, loadProducts]);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
    };

    if(error){
        return (
            <View style={styles.centered}>
                <Text>An error occured!</Text>
                <Button title='Try again' onPress={loadProducts} color={colors.primary}></Button>
            </View>
        )
    }

    if(isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={colors.primary}>

                </ActivityIndicator>
            </View>
        )
    }

    if(!isLoading && products.length === 0)
    {
        return (
            <View style={styles.centered}>
                <Text>No products found. Start adding some!</Text>
            </View>
        )
    }

    return (
        <FlatList
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            data={products}
            keyExtractor={item => item.id}
            // here at renderItem => ProductItem we pass parameters that need for component
            renderItem={itemData => (
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    //onSelect is function at ProductItem component
                    onSelect={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title)
                    }}
                    //we moved onAddToCart downside at Button
                    //onAddToCart={() => {
                    //dispatch(cartActions.addToCart(itemData.item))
                    // }}

                    >
                    <Button
                        color={colors.primary}
                        title='View Details'
                        onPress={() => {selectItemHandler(itemData.item.id, itemData.item.title)}}>
                    </Button>

                    <Button
                        color={colors.primary}
                        title='To Cart'
                        onPress={() => {dispatch(cartActions.addToCart(itemData.item))}}>
                    </Button>
                </ProductItem>)}>
        </FlatList>
    );
};

// const styles = StyleSheet.create({

//   });

//here we can use static navigation properties
ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Products', //This will be show in header of screen
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
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Cart'
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => {
                        navData.navigation.navigate('Cart')
                    }}>
                </Item>
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ProductsOverviewScreen;