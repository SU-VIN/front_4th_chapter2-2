import { CartItem, Coupon, Product } from '../../shared/types/types.ts';
import { useCart } from '../../hooks/index.ts';
import CartSummaryWidget from '../../widgets/user/CartSummaryWidget.tsx';
import ProductListWidget from '../../widgets/user/ProductListWidget.tsx';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const { cart, addToCart, removeFromCart, updateQuantity, applyCoupon, calculateTotal, selectedCoupon } = useCart();

  const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
    return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
  };

  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  const getAppliedDiscount = (item: CartItem) => {
    const { discounts } = item.product;
    const { quantity } = item;
    let appliedDiscount = 0;
    for (const discount of discounts) {
      if (quantity >= discount.quantity) {
        appliedDiscount = Math.max(appliedDiscount, discount.rate);
      }
    }
    return appliedDiscount;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 상품 목록 위젯 */}
        <ProductListWidget
          products={products}
          onAddToCart={addToCart}
          getRemainingStock={getRemainingStock}
          getMaxDiscount={getMaxDiscount}
        />
        {/* 장바구니 요약 위젯 */}
        <CartSummaryWidget
          cart={cart}
          coupons={coupons}
          selectedCoupon={selectedCoupon}
          totalBeforeDiscount={totalBeforeDiscount}
          totalAfterDiscount={totalAfterDiscount}
          totalDiscount={totalDiscount}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          onApplyCoupon={applyCoupon}
          getAppliedDiscount={getAppliedDiscount}
        />
      </div>
    </div>
  );
};
