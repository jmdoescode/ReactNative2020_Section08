import {ADD_TO_CART} from "../actions/cart";
import CartItem from "../../models/cart-item";

const initialState = {
  items: {},
  totalAmount: 0
}

export default (state = initialState, action) => {
  switch(action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;

      let newOrExistingItem;

      if(state.items[addedProduct.id]){
        newOrExistingItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
        console.log("existing");
      } else {
        newOrExistingItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
        console.log("new");
      }

      console.log(state);

      return {
        ...state,
        items: {...state.items, [addedProduct.id]: newOrExistingItem},
        totalAmount: state.totalAmount + prodPrice
      }
  }

  return state;
}