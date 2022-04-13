import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import { ADD_ORDER } from "../actions/orders";
import CartItem from "../../models/cart-item";
import { DELETE_PRODUCT } from "../actions/product";

const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {
    //action.type => type its created at actions/cart.js
    switch (action.type) {
        case ADD_TO_CART:
            //action.product => product its created at actions/cart.js and now we are using that
            const addedProduct = action.product;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;

            //updatedOrNewCartItem => here we save new item or we update existing items and than we just pass it at return
            let updatedOrNewCartItem;

            if (state.items[addedProduct.id]) {
                // already have the item in the cart
                // or if its updated e.g quantity 
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1, //we update the quantity
                    prodPrice, //price of product its same so we just get it
                    prodTitle, //title its same
                    state.items[addedProduct.id].sum + prodPrice, //sum its changed because of quantity
                );

            }
            else {
                //last param sum its prodPrice
                //new item in cart
                updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
            }

            return {
                //now we add items to cart items => we will fill with data items that we create at const initialState
                ...state, //copy of existing state
                items: {
                    //copy exisitng state of items => items from initialState function
                    //than we add new key [addedProduct.id] and 
                    //the value => newCartItem
                    ...state.items, [addedProduct.id]: updatedOrNewCartItem
                },
                //total amount = total amount + prod price
                totalAmount: state.totalAmount + prodPrice
            };

        case REMOVE_FROM_CART:
            //action.pid => pid we get from actions/cart.js const REMOVE_FROM_CART
            const currentQty = state.items[action.pid].quantity;
            const selectedCartItem = state.items[action.pid];
            let updatedCartItems; //this is used to erase items in else function

            if (currentQty > 1) {
                //need to reduce it, not erase it
                const updatedCartItem = new CartItem(
                    selectedCartItem.quantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice
                );
                //carefully on variable: we have updatedCartItem(s) with (s) and updatedCartItem
                //here we are updating updatedCartItems that we use for delete with new Item that we reduce it from updatedCartItem
                updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
            }
            else {
                //need to erase it
                //...state.items we clone state of items (copy actually state of items)
                updatedCartItems = { ...state.items };

                //delete the item for this id;
                delete updatedCartItems[action.pid];
            }
            return {
                //here we are updating items and totalAmount that we have in const initialState, because after we delete any items, it should be update the list
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount.toFixed(2) - selectedCartItem.productPrice
            };

        //we need to clear the cart (CartScreen), soo we just return initialState because initialState first its empty
        case ADD_ORDER:
            return initialState;
            
        case DELETE_PRODUCT:
            if(!state.items[action.pid])
            {
                return state;
            }
            const updatedItems = {...state.items};
            const itemTotal = state.items[action.pid].sum;
            delete updatedItems[action.pid];
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }    
    }
    return state;
};