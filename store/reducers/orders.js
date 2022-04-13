import Order from "../../models/order";
import { ADD_ORDER, SET_ORDERS } from "../actions/orders";

const initialState = {
    orders: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_ORDERS:
            return {
                orders: action.orders
            }
        case ADD_ORDER:
            //action.orderData.items => we get from actions/orders.js => function addOrder
            //Order is class that we have created at models, soo we need to pass data that it's required on constructor
            //as ID => for now we are using date because it will be always unique id from Date
            const newOrder = new Order(
                //this is ID that we have create with date
                // new Date().toString(),
                //now here we get id from actions/orders.js
                action.orderData.id,
                action.orderData.items,
                action.orderData.amount,
                action.orderData.date
            );

            return {
                ...state,
                //concat its a function that adds a new item to an array and returns a new array that includes that item,
                //so the old array stays untoucher, the new array is returned and of course allows us to update this,
                //where we never touch the original data but we set the new state by creating a brand new array,
                //that includes new object and there i simply concatenate my newOrder
                orders: state.orders.concat(newOrder)
            }
    }

    return state;
};