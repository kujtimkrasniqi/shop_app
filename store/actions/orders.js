import Order from "../../models/order";

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch(`https://shop-app-bf460-default-rtdb.europe-west1.firebasedatabase.app/orders/${userId}.json`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            const resData = await response.json();
            //resData is as a object in app we worked with array so we need to transform it to array
            const loadedOrders = [];

            for (const key in resData) {
                loadedOrders.push(new Order(
                    key,
                    resData[key].cartItems,
                    resData[key].totalAmount,
                    new Date(resData[key].date)
                )
                );
            }

            dispatch({
                type: SET_ORDERS,
                orders: loadedOrders
            });
        } catch (err) {
            throw err;
        }
    };
};

//to add orders we need items on card and total amount
export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const date = new Date();

        //here we are saving for dummy users u1, later we will have a real ID here, a dynamic ID
        const response = await fetch(`https://shop-app-bf460-default-rtdb.europe-west1.firebasedatabase.app/orders/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date: date.toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Something went wrong');
        }

        const resData = await response.json();

        dispatch({
            type: ADD_ORDER,
            orderData: {
                id: resData.name,
                items: cartItems,
                amount: totalAmount,
                date: date
            }
        });
    };

    // return {
    //     type: ADD_ORDER,
    //     orderData: {
    //         items: cartItems,
    //         amount: totalAmount
    //     }
    // };
};