class CartItem {
  constructor(quantity, productPrice, productTitle, pushToken, sum) {
    this.quantity = quantity;
    this.productPrice = productPrice;
    this.productTitle = productTitle;
    this.sum = sum;
    this.pushToken = pushToken;
  }
}

export default CartItem;