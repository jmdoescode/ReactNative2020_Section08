export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';

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