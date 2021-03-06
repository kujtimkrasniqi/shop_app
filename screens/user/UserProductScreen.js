import React from 'react';
import { FlatList, Button, Platform, Alert, View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';

import ProductItem from '../../components/shop/ProductItem';
import colors from '../../constants/colors';
import * as producsAction from '../../store/actions/product';

const UserProductScreen = props => {
    //state.products => products its at App.js at rootReducer
    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();

    const editProductHandler = (id) => {
        props.navigation.navigate('EditProduct', { productId: id });
    };

    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', 'Do you want to delete this item?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes', 
                style: 'destructive', 
                onPress: () => {
                    dispatch(producsAction.deleteProduct(id));
                }
            }
        ]);
    };

    if(userProducts.length === 0)
    {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>No products found, start creating some?</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={userProducts}
            keyExtractor={item => item.id}
            renderItem={itemData =>
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => { }}
                >
                    <Button
                        color={colors.primary}
                        title='Edit'
                        onPress={() => { editProductHandler(itemData.item.id); }}>
                    </Button>

                    <Button
                        color={colors.primary}
                        title='Delete'
                        onPress={deleteHandler.bind(this, itemData.item.id)}>
                    </Button>
                </ProductItem>
            }>
        </FlatList>
    );
};

UserProductScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Products',
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
                <Item title='Add'
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    onPress={() => {
                        //we dont sent any ID to editProduct because we use same one to create new product
                        navData.navigation.navigate('EditProduct');
                    }}>
                </Item>
            </HeaderButtons>
        ),
    }
}

export default UserProductScreen;