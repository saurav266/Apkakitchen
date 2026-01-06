import User from "../model/userSchema.js";

/* =========================
   GET CART
========================= */
export const getCart = async (req, res) => {
  const user = await User.findById(req.user.id).select("cart");

  res.json({
    success: true,
    cart: user.cart,
  });
};

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (req, res) => {
  const {
    productId,
    variantId,
    name,
    image,
    price,
    qty = 1,
  } = req.body;

  const cartItemId = variantId
    ? `${productId}_${variantId}`
    : productId;

  const user = await User.findById(req.user.id);

  const existing = user.cart.find(
    (i) => i.cartItemId === cartItemId
  );

  if (existing) {
    existing.qty += qty;
  } else {
    user.cart.push({
      cartItemId,
      product: productId,
      variant: variantId || null,
      name,
      image,
      price,
      qty,
    });
  }

  await user.save();

  res.json({
    success: true,
    cart: user.cart,
  });
};

/* =========================
   UPDATE QTY
========================= */
export const updateCartItem = async (req, res) => {
  const { cartItemId, qty } = req.body;

  const user = await User.findById(req.user.id);

  const item = user.cart.find(
    (i) => i.cartItemId === cartItemId
  );

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Cart item not found",
    });
  }

  if (qty <= 0) {
    user.cart = user.cart.filter(
      (i) => i.cartItemId !== cartItemId
    );
  } else {
    item.qty = qty;
  }

  await user.save();

  res.json({
    success: true,
    cart: user.cart,
  });
};

/* =========================
   REMOVE ITEM
========================= */
export const removeCartItem = async (req, res) => {
  const { cartItemId } = req.params;

  const user = await User.findById(req.user.id);

  user.cart = user.cart.filter(
    (i) => i.cartItemId !== cartItemId
  );

  await user.save();

  res.json({
    success: true,
    cart: user.cart,
  });
};

/* =========================
   CLEAR CART
========================= */
export const clearCart = async (req, res) => {
  const user = await User.findById(req.user.id);

  user.cart = [];
  await user.save();

  res.json({
    success: true,
  });
};

/* =========================
   SYNC GUEST CART → USER CART
========================= */
export const syncCart = async (req, res) => {
  const { items = [] } = req.body;

  const user = await User.findById(req.user.id);

  for (const guestItem of items) {
    const existing = user.cart.find(
      (i) => i.cartItemId === guestItem.cartItemId
    );

    if (existing) {
      // merge qty
      existing.qty += guestItem.qty;
    } else {
      user.cart.push({
        cartItemId: guestItem.cartItemId,
        product: guestItem.productId,
        variant: guestItem.variantId || null,
        name: guestItem.name,
        image: guestItem.image,
        price: guestItem.finalPrice || guestItem.price,
        qty: guestItem.qty,
      });
    }
  }

  await user.save();

  res.json({
    success: true,
    cart: user.cart,
  });
};