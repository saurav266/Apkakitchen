// utils/cart.js

export const CART_KEY = "cart";

/* ---------- LOCAL CART ---------- */
export const getLocalCart = () => {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

export const setLocalCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

/* ---------- ADD ITEM (UNIVERSAL) ---------- */
export const addItemToCart = (item) => {
  let cart = getLocalCart();

  const index = cart.findIndex(
    (i) => i.cartItemId === item.cartItemId
  );

  if (index > -1) {
    cart[index].qty += item.qty;
  } else {
    cart.push(item);
  }

  setLocalCart(cart);
};

/* ---------- UPDATE QTY ---------- */
export const updateItemQty = (cartItemId, delta) => {
  let cart = getLocalCart();

  cart = cart
    .map((i) =>
      i.cartItemId === cartItemId
        ? { ...i, qty: i.qty + delta }
        : i
    )
    .filter((i) => i.qty > 0);

  setLocalCart(cart);
};

/* ---------- REMOVE ---------- */
export const removeItem = (cartItemId) => {
  const cart = getLocalCart().filter(
    (i) => i.cartItemId !== cartItemId
  );
  setLocalCart(cart);
};
