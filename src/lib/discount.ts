export type Discount = {
  created_at: string;
  discount_type: string;
  ends_at: string;
  id: string;
  product_id: string;
  starts_at: string;
  value: number;
};
 
  export const isDiscountActive = (discount?: Discount): boolean => {
    if (!discount) return false;

    const now = new Date();
    return (
      new Date(discount.starts_at) <= now && now <= new Date(discount.ends_at)
    );
  };
  
  
  export const getDiscountedPrice = (price: number, discount?: Discount): number => {
    if (!discount || !isDiscountActive(discount)) return price;
  
    return discount.discount_type === 'percentage'
      ? price * (1 - discount.value / 100)
      : price - discount.value;
  };
  

  export const getDiscountPercentage = (
    price: number,
    discount: Discount
  ): number => {
    const discountedPrice = getDiscountedPrice(price, discount);
    const percentage = ((price - discountedPrice) / price) * 100;
    return Math.round(percentage);
  };
  