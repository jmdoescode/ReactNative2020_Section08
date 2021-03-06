import Product from "../../models/product";
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    try {
      const userId = getState().auth.userId;
      const response = await fetch('https://rn-complete-guide-dc18b.firebaseio.com/products.json');
      //10.202 - fetch api does not throw error if 400 & 500 status code range occurs
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const responseData = await response.json();

      //console.log(responseData); //10.202 - returns an object
      const loadedProducts = [];

      //10.202 - since responseData returns an object, you need to transform it to an Array
      //    each object is matched to it's uniqueID (key)
      for (const key in responseData) {
        //console.log("ownerId: " + (responseData[key].ownerId ? responseData[key].ownerId : null));
        loadedProducts.push(new Product(
          key,
          responseData[key].ownerId ? responseData[key].ownerId : null,
          responseData[key].ownerPushToken,
          responseData[key].title,
          responseData[key].imageUrl,
          responseData[key].description,
          responseData[key].price
        ))
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
      });
    } catch (err) {
      //TODO: send to analytics server
      throw err;
    }
  }
}

export const deleteProduct = productId  => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`https://rn-complete-guide-dc18b.firebaseio.com/products/${productId}.json?auth=${token}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({
      type: DELETE_PRODUCT,
      pid: productId
    });
  };
};

export const createProduct = (title, imageUrl, description, price) => {
  //10.201 - using async await will make the entire action (createProduct) return a promise
  return async (dispatch, getState) => {
    let pushToken;
    let statusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if(statusObj.status !== 'granted') {
      statusObj = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    }
    if(statusObj.status !== 'granted'){
      pushToken = null;
    } else {
      pushToken = (await Notifications.getExpoPushTokenAsync()).data;
    }

    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(`https://rn-complete-guide-dc18b.firebaseio.com/products.json?auth=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price,
        ownerId: userId,
        ownerPushToken: pushToken
      })
    });
    //}).then(() => response...); //10.201 - then() is replaced by async await

    //10.201 - this will return the data from firebase when we create a product
    const responseData = await response.json();

    dispatch({
        type: CREATE_PRODUCT,
        //8.184 - modern javascript notation if variable is same name as the data model param
        //    then you just need to put variable name instead of title = title
        productData: {
          id: responseData.name,
          title,
          imageUrl,
          description,
          price,
          ownerId: userId,
          pushToken: pushToken
        }
    });
  }
};

export const updateProduct = (id, title, imageUrl, description,) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    // console.log("UPDATE - TOKEN: " + token);
    const response = await fetch(`https://rn-complete-guide-dc18b.firebaseio.com/products/${id}.json?auth=${token}`, {
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

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        imageUrl,
        description
      }
    });
  };
};