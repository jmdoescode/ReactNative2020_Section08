import PRODUCTS from './../../data/dummy-data';
import {CREATE_PRODUCT, DELETE_PRODUCT, SET_PRODUCTS, UPDATE_PRODUCT} from "../actions/product";
import Product from "../../models/product";

const initialState = {
  availableProducts: [],
  userProducts: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        ...state,
        availableProducts: action.products,
        userProducts: action.userProducts
      };

    case CREATE_PRODUCT:
      const newProduct = new Product(
        //new Date().toString(), //8.184 - temporary
        action.productData.id, //10.201 - update to use the id that is coming from firebase
        action.productData.ownerId,
        action.productData.pushToken,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );

      return{
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct)
      };


    case UPDATE_PRODUCT:
      const userProductIndex = state.userProducts.findIndex(prod => prod.id === action.pid);
      const updatedProduct = new Product(
        action.id,
        state.userProducts[userProductIndex].ownerId,
        state.userProducts[userProductIndex].pushToken,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[userProductIndex].price
      );

      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[userProductIndex] = updatedProduct;

      const availableProductIndex = state.availableProducts.findIndex(prod => prod.id === action.pid);
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProductIndex] = updatedProduct;

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts
      };


    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(product => product.id !== action.pid),
        availableProducts: state.availableProducts.filter(product => product.id !== action.pid)
      }
  }

  return state;
}
