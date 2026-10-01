export type CartItem = {
  dogId: number;
  kind: string;
  price: number;
  image: string | null;
  quantity: number;
  amount: number;
};

export type Cart = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
};
