import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
//SET PRODUCTS we need to get data from server
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        //any async code u want!
        try {
            const response = await fetch('https://shop-app-bf460-default-rtdb.europe-west1.firebasedatabase.app/products.json', {
                method: 'GET'
            });

            if(!response.ok) {
                throw new Error('Something went wrong');
            }
    
            const resData = await response.json();
            //resData is as a object in app we worked with array so we need to transform it to array
            const loadedProducts = [];
    
            for (const key in resData) {
                loadedProducts.push(new Product(
                    key,
                    resData[key].ownerId,
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].description,
                    resData[key].price
                )
                );
            }
    
            console.log(resData);
            dispatch({
                type: SET_PRODUCTS,
                products: loadedProducts,
                userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
            });
        } catch (err) {
            // send to custom analytic server.. or whatever u want
            throw err;
        }
        
    };
};

export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://shop-app-bf460-default-rtdb.europe-west1.firebasedatabase.app/products/${productId}.json?auth=${token}`, {
            method: 'DELETE'
        });

        if(!response.ok) {
            throw new Error('Something went wrong');
        }

        dispatch({
            type: DELETE_PRODUCT, pid: productId
        });
    }

    // return {
    //     type: DELETE_PRODUCT, pid: productId
    // };
   
};

//here we put params that we except to get
export const createProduct = (title, description, imageUrl, price) => {
    //ReduxThunk implement dispatch:
    //with async await now function createProduct will return a <Promise> thats our response
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        // u can execute any async code u want!
        // here we can send a http request in react native we can use fetch API
        //copy URL from firebase
        //we added after main url products '/products.json' so firebase will make a folder automaticlly with name products
        // products.json its not required by react native or http but its Firebase specific thing
        const response = await fetch(`https://shop-app-bf460-default-rtdb.europe-west1.firebasedatabase.app/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            })
        });

        const resData = await response.json();

        console.log(resData);

        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                //we can add ID here to forward server side generated ID to our create product at reducers/product.js
                id: resData.name,
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            }
        });
    };
    // return {
    //     type: CREATE_PRODUCT,
    //     productData: {
    //         title,
    //         description,
    //         imageUrl,
    //         price
    //     }
    // };
};

//we dont need price cause it shouldnt update
export const updateProduct = (id, title, description, imageUrl) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        // console.log(getState());
        // `` will allow us to inject a specific data e.g with ${id}
        //we need to pass auth because rules write: auth
        const response = await fetch(`https://shop-app-bf460-default-rtdb.europe-west1.firebasedatabase.app/products/${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl
            })
        });

        if(!response.ok) {
            throw new Error('Something went wrong');
        }

        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: {
                title,
                description,
                imageUrl
            }
        });
    };
    // return {
    //     type: UPDATE_PRODUCT,
    //     pid: id,
    //     productData: {
    //         title,
    //         description,
    //         imageUrl
    //     }
    // };
};