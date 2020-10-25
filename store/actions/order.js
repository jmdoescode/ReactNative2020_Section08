import Product from "../../models/product";
import {SET_PRODUCTS} from "./product";
import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
  return async dispatch => {
    try {
      const response = await fetch('https://rn-complete-guide-dc18b.firebaseio.com/orders/u1.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const responseData = await response.json();
      const loadedOrders = [];

      for (const key in responseData) {
        loadedOrders.push(new Order(
          key,
          responseData[key].items,
          responseData[key].totalAmount,
          new Date(responseData[key].date) //10.209 - Need date object not just the string
        ))
      }

      dispatch({
        type: SET_ORDERS,
        orders: loadedOrders
      })
    } catch (err) {
      //TODO: send to analytics server
      throw err;
    }
  }
}

export const addOrder = (cartItems, totalAmount) => {
  return async dispatch => {
    const date = new Date();
    const response = await fetch('https://rn-complete-guide-dc18b.firebaseio.com/orders/u1.json', {
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

    const responseData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: responseData.name,
        items: cartItems,
        amount: totalAmount,
        date: date
      }
    })
  }
}