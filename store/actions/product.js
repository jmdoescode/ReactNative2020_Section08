import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
  return async dispatch => {
    try {
      const response = await fetch('https://rn-complete-guide-dc18b.firebaseio.com/product.json');
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
        loadedProducts.push(new Product(
          key,
          'u1',
          responseData[key].title,
          responseData[key].imageUrl,
          responseData[key].description,
          responseData[key].price
        ))
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts
      });
    } catch (err) {
      //TODO: send to analytics server

      throw err;
    }
  }
}

export const deleteProduct = productId  => {
  return {
    type: DELETE_PRODUCT,
    pid: productId
  }
};

export const createProduct = (title, imageUrl, description, price) => {
  //10.201 - using async await will make the entire action (createProduct) return a promise
  return async dispatch => {
    const response = await fetch('https://rn-complete-guide-dc18b.firebaseio.com/products.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price
      })
    });
    //}).then(() => response...); //10.201 - then() is replaced by async await

    //10.201 - this will return the data from firebase when we create a product
    const responseData = await response.json();

    //console.log(responseData);

    dispatch({
        type: CREATE_PRODUCT,
        //8.184 - modern javascript notation if variable is same name as the data model param
        //    then you just need to put variable name instead of title = title
        productData: {
          id: responseData.name,
          title,
          imageUrl,
          description,
          price
        }
    });
  }
};

export const updateProduct = (id, title, imageUrl, description,) => {
  return {
    type: UPDATE_PRODUCT,
    pid: id,
    productData: {
      title,
      imageUrl,
      description
    }
  }
}