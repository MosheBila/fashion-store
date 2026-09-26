// Cart management utilities using localStorage

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const CART_KEY = 'fashion-store-cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

export function addToCart(product: {
  id: number;
  name: string;
  price: number;
  image_url: string;
}, quantity: number = 1): void {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.image_url,
    });
  }

  saveCart(cart);
}

export function removeFromCart(productId: number): void {
  const cart = getCart();
  const filtered = cart.filter((item) => item.productId !== productId);
  saveCart(filtered);
}

export function updateQuantity(productId: number, quantity: number): void {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);

  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

export function clearCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_KEY);
}

export function getCartTotal(): {
  items: number;
  subtotal: number;
} {
  const cart = getCart();
  return {
    items: cart.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
}
