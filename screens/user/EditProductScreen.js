import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { FlatList, Button, Platform, View, Text, StyleSheet, TextInput, ScrollView, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/product';
import Input from '../../components/UI/Input';
import colors from '../../constants/colors';

//you can name it how ever u want
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

//we will create formReducer to merge all useStates in one place
const formReducer = (state, action) => {
    //action.type => u can name it how ever u want
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            //we are copying all key-value of that input values snapshot than we want to replace the key value pair for the input which the action was dispatched
            ...state.inputValues,
            //.input we call from dispatchFormState and value is: e.g title, imageUrl, price, description
            [action.input]: action.value
        };

        const updatedValidities = {
            ...state.inputValidities,
            //.isValid we call from dispatchFormState and replace this with action is valid
            [action.input]: action.isValid
        };

        //now we need to manage overall from validity, for that loop all updatedValidities
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }

        return {
            //all of those 3 valuse: formIsValid, inputValidites, inputValues are declared at useReducer down
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        };
    }
    return state;
};

const EditProductScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    //we get prodId to check than if we are in EDIT mode OR ADD mode
    const prodId = props.navigation.getParam('productId');

    //userProducts we get from reducers/product.js
    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId));

    const dispatch = useDispatch();

    //useReducer, this si initial state that we pass here and thats the state which later want to change from inside function formReducer
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false,
        },
        formIsValid: editedProduct ? true : false
    });

    // FROM ---- START TILL ----- END WE WILL REPLACE WITH useREDUCER because its more clean
    // ------- START
    // //we use useState to populate with data
    // //we initialize state here
    // //here we check if we are in edit mode than return data to edit or return ''

    // const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');

    // //THIS IS TO VALIDATE TITLE
    // const [titleIsValid, setTitleIsValid] = useState(false);
    // const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');

    // //we dont do for the price cause price shouldnt be changeable
    // const [price, setPrice] = useState('');
    // const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');

    // ------- END

    //this is for error
    useEffect(() => {
        if(error) {
            Alert.alert('An error occurred!', error, [{text: 'Okay'}]);
        }
    }, [error]);

    const submitHandler = useCallback(async () => {
        //if TITLE its not VALID so cancel execution of function
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please check the errors in the form.', [
                { text: 'Okay' }
            ]);
            return;
        }
        // console.log('Submitting');

        setError(null);
        setIsLoading(true);

        try{
            if (editedProduct) {
                //await will wait till dispatch will done
                await dispatch(productsActions.updateProduct(
                    prodId,
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl
                ));
            }
            else {
                //add Product
                //price is getting as string to convert as number just add +price
                await dispatch(productsActions.createProduct(
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl,
                    +formState.inputValues.price
                ));
            }
            props.navigation.goBack();
        } catch (err) {
            setError(err.message);
        }
        
        //after dispatch will run we set loading to false 
        setIsLoading(false);

        // props.navigation.goBack();
    }, [dispatch, prodId, formState]);

    //this will not allow to loop submitHandler
    useEffect(() => {
        props.navigation.setParams({ 'submit': submitHandler });
    }, [submitHandler]);

    //THIS IS TO VALIDATE INPUTS
    //inputIdentifier (u can name it how u want) help us to know which input is,
    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        // let isValid = false;
        // //trim we use to dont treated white space as valid
        // if (text.trim().length > 0) {
        //     // setTitleIsValid(false);
        //     isValid = true;
        // }

        //type, value is a name u can name it how ever u want
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            //input: title => title should be same like inputValues
            //we need input to let reducer know which input triggered this
            input: inputIdentifier
        });
        //here inside [] we check that this function will not rebuild if its not neccesarily
    }, [dispatchFormState]);

    if(isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={colors.primary}>

                </ActivityIndicator>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={100}>
            <ScrollView>
                <View style={styles.form}>
                    {/* TO OPTIMIZE CODE WE WILL USE INPUT COMPONENT */}
                    {/* <View style={styles.formControl}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput style={styles.input}
                        value={formState.inputValues.title}
                        onChangeText={textChangeHandler.bind(this, 'title')}
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        // returnKeyType='next' => in keyboard return key will be change to NEXT
                        returnKeyType='next'
                        // onEndEditing => if we go at next Input e.g in this case at ImageURL than onEndEditing will be execute
                        onEndEditing={() => console.log('onEndEditing')}
                        //this will be execute only when we click KeyType = next
                        onSubmitEditing={() => console.log('onSubmitEditing')}
                    >
                    </TextInput>
                    CHECK IF TITLE IS NOT VALID
                    {!formState.inputValidities.title && <Text>Please enter a valid title!</Text>}
                </View> */}
                    <Input
                        id='title'
                        label='Title'
                        errorText='Please enter a valid title!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        // returnKeyType='next' => in keyboard return key will be change to NEXT
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                    >
                    </Input>
                    <Input
                        id='imageUrl'
                        label='Image URL'
                        errorText='Please enter a valid image url!'
                        keyboardType='default'
                        // returnKeyType='next' => in keyboard return key will be change to NEXT
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={!!editedProduct}
                        required
                    >
                    </Input>

                    {/* <View style={styles.formControl}>
                    <Text style={styles.label}>Image URL</Text>
                    <TextInput style={styles.input}
                        value={formState.inputValues.imageUrl}
                        onChangeText={textChangeHandler.bind(this, 'imageUrl')}>
                    </TextInput>
                </View> */}
                    {/* check if its in editedmode return null else return price */}
                    {editedProduct ? null : (

                        <Input
                            id='price'
                            label='Price'
                            errorText='Please enter a valid price!'
                            keyboardType='decimal-pad'
                            // returnKeyType='next' => in keyboard return key will be change to NEXT
                            returnKeyType='next'
                            onInputChange={inputChangeHandler}
                            required
                            min={0.1}
                        >
                        </Input>

                        // <View style={styles.formControl}>
                        //     <Text style={styles.label}>Price</Text>
                        //     <TextInput style={styles.input}
                        //         value={formState.inputValues.price}
                        //         onChangeText={textChangeHandler.bind(this, 'price')}
                        //         keyboardType='decimal-pad'>
                        //     </TextInput>
                        // </View>
                    )}
                    <Input
                        id='description'
                        label='Description'
                        errorText='Please enter a valid description!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        onInputChange={inputChangeHandler}
                        multiline
                        numberOfLines={3}
                        initialValue={editedProduct ? editedProduct.description : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                    >
                    </Input>

                    {/* <View style={styles.formControl}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput style={styles.input}
                        value={formState.inputValues.description}
                        onChangeText={textChangeHandler.bind(this, 'description')}>
                    </TextInput>
                </View> */}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

EditProductScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        //productId is at function editProductHandler in UserProductScreen and we get it from there
        headerTitle: navData.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Save'
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    onPress={submitFn}>
                </Item>
            </HeaderButtons>
        )
    }
};

const styles = StyleSheet.create({
    form: {
        margin: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
    //WE MOVED TO INPUT COMPONENT
    // formControl: {
    //     width: '100%',
    // },
    // label: {
    //     marginVertical: 8,
    // },
    // input: {
    //     paddingHorizontal: 2,
    //     paddingVertical: 5,
    //     borderBottomColor: '#ccc',
    //     borderBottomWidth: 1,
    // }
});

export default EditProductScreen;