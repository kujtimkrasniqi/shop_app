import PRODUCTS from "../../data/dummy-data";
import Product from "../../models/product";
import { CREATE_PRODUCT, DELETE_PRODUCT, SET_PRODUCTS, UPDATE_PRODUCT } from "../actions/product";

const initialState = {
    availableProducts: [],
    userProducts: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PRODUCTS:
            return {
                //action.products is at actions/products.js at fetchProduct function inside of dispatch function
                availableProducts: action.products,
                userProducts: action.userProducts
            };
        case CREATE_PRODUCT:
            //productData is at actions/productData
            const newProduct = new Product(
                // new Date().toString(),
                //this is serverside id that we are getting from actions/product.js
                action.productData.id,
                // 'u1',
                action.productData.ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                action.productData.price
            );
            return {
                ...state,
                //here we get first availableProducts existing than we add new product with concat
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            };
        case UPDATE_PRODUCT:
            //here we should find the product base on id that we want to update
            const productIndex = state.userProducts.findIndex(prod => prod.id === action.pid);
            //we keep some old data action.pid and ownerId, those wont change
            //title and others data will change
            const updatedProduct = new Product(
                action.pid,
                state.userProducts[productIndex].ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                //price shouldnt change so we take existing one
                state.userProducts[productIndex].price,
            );
            //we copy exisiting userProduct first
            const updatedUserProducts = [...state.userProducts];
            //than we update selected product with new one
            updatedUserProducts[productIndex] = updatedProduct;
            const availableProductIndex = state.availableProducts.findIndex(prod => prod.id === action.pid);
            const updatedAvailableProduct = [...state.availableProducts];
            updatedAvailableProduct[availableProductIndex] = updatedProduct;
            return {
                ...state,
                availableProducts: updatedAvailableProduct,
                userProducts: updatedUserProducts
            }
        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(product => product.id !== action.pid),
                availableProducts: state.availableProducts.filter(product => product.id !== action.pid)
            };
    }
    return state;
};