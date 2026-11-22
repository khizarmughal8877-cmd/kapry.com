import {FormEvent, useEffect, useMemo, useState} from 'react';
import {
  CheckCircle2,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import {
  ClothingSize,
  FLAT_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  Product,
  WHATSAPP_NUMBER,
} from '../data/catalog';
import {ProductImage} from './ProductImage';

export interface CartItem {
  product: Product;
  size: ClothingSize;
  quantity: number;
}

interface ConfirmedOrder {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  savings: number;
  shipping: number;
  total: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, size: ClothingSize, delta: number) => void;
  onRemoveItem: (productId: string, size: ClothingSize) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );

  const clearanceSavings = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (
          item.product.originalPrice &&
          item.product.originalPrice > item.product.price
        ) {
          return (
            sum + (item.product.originalPrice - item.product.price) * item.quantity
          );
        }
        return sum;
      }, 0),
    [items],
  );

  const shippingFee =
    items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
  const grandTotal = subtotal + shippingFee;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const whatsappHref = useMemo(() => {
    const lines = [
      'Hello kapry.com! I would like to place an order:',
      '',
      ...items.map(
        (item) =>
          `- ${item.product.name} | Size: ${item.size} | Qty: ${item.quantity} | Rs. ${(
            item.product.price * item.quantity
          ).toLocaleString()}`,
      ),
      '',
      `Subtotal: Rs. ${subtotal.toLocaleString()}`,
      ...(clearanceSavings > 0
        ? [`Clearance Savings: Rs. ${clearanceSavings.toLocaleString()}`]
        : []),
      `Shipping: ${shippingFee === 0 ? 'Free' : `Rs. ${shippingFee.toLocaleString()}`}`,
      `Total: Rs. ${grandTotal.toLocaleString()}`,
    ];
    if (customerName.trim()) {
      lines.push(`Customer: ${customerName.trim()}`);
    }
    if (phone.trim()) {
      lines.push(`Phone: ${phone.trim()}`);
    }
    if (address.trim()) {
      lines.push(`Address: ${address.trim()}${city.trim() ? `, ${city.trim()}` : ''}`);
    }
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [
    items,
    subtotal,
    clearanceSavings,
    shippingFee,
    grandTotal,
    customerName,
    phone,
    address,
    city,
  ]);

  const handlePlaceCodOrder = (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setFormError('Your shopping bag is currently empty.');
      return;
    }
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setFormError('Please enter your name, phone number, and delivery address.');
      return;
    }

    setFormError('');
    const orderNumber = `KP-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrder({
      orderNumber,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: `${address.trim()}${city.trim() ? `, ${city.trim()}` : ''}`,
      items: [...items],
      subtotal,
      savings: clearanceSavings,
      shipping: shippingFee,
      total: grandTotal,
    });
    onClearCart();
    setCustomerName('');
    setPhone('');
    setAddress('');
    setCity('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      <aside
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-stone-900" />
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-stone-900">
              Shopping Bag
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrder(null);
              onClose();
            }}
            aria-label="Close shopping bag"
            className="w-10 h-10 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {confirmedOrder ? (
            <div className="py-6 space-y-5">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">
                    Order #{confirmedOrder.orderNumber} Confirmed — Preparing Shipment
                  </p>
                  <p className="text-xs text-emerald-800 mt-1">
                    Thank you, {confirmedOrder.customerName}. Cash on Delivery scheduled for {confirmedOrder.address}.
                  </p>
                </div>
              </div>

              <div className="border border-stone-200 rounded-lg p-4 space-y-3">
                <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                  Order Receipt
                </p>
                <div className="divide-y divide-stone-100">
                  {confirmedOrder.items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="py-2 flex items-center justify-between text-sm"
                    >
                      <span className="text-stone-700">
                        {item.product.name} ({item.size}) × {item.quantity}
                      </span>
                      <span className="font-medium text-stone-900 tabular-nums">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-stone-200 space-y-1 text-sm">
                  {confirmedOrder.savings > 0 && (
                    <div className="flex justify-between text-[#9a5b13] font-medium">
                      <span>Clearance Savings</span>
                      <span className="tabular-nums">
                        - Rs. {confirmedOrder.savings.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping</span>
                    <span className="tabular-nums">
                      {confirmedOrder.shipping === 0
                        ? 'Free'
                        : `Rs. ${confirmedOrder.shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-stone-900 text-base pt-1">
                    <span>Total Due (COD)</span>
                    <span className="tabular-nums">
                      Rs. {confirmedOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setConfirmedOrder(null);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-md bg-stone-900 text-white text-sm font-semibold hover:bg-[#b77a15] transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-base font-semibold text-stone-900">Your bag is empty</p>
              <p className="text-sm text-stone-500 max-w-xs mx-auto">
                Explore the kapry.com collection, baggy shirts, graphic hoodies, and clearance deals to begin an order.
              </p>
            </div>
          ) : (
            <>
              <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 flex items-center gap-3 text-xs text-stone-700">
                <Truck className="w-4 h-4 text-[#b77a15] shrink-0" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Add{' '}
                    <strong className="tabular-nums">
                      Rs. {remainingForFreeShipping.toLocaleString()}
                    </strong>{' '}
                    more for free nationwide shipping.
                  </span>
                ) : (
                  <span className="font-medium text-stone-900">
                    Your order qualifies for free nationwide shipping.
                  </span>
                )}
              </div>

              <div className="divide-y divide-stone-200">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="py-4 flex gap-4 items-start"
                  >
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.name}
                      title={item.product.name}
                      className="w-20 h-20 rounded-md shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-stone-900 truncate">
                          {item.product.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id, item.size)}
                          aria-label={`Remove ${item.product.name} size ${item.size}`}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 tabular-nums">
                        Size: {item.size} · Rs. {item.product.price.toLocaleString()}
                        {item.product.originalPrice && (
                          <span className="ml-1.5 line-through text-stone-400">
                            Rs. {item.product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-stone-200 rounded-md">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.size, -1)
                            }
                            aria-label="Decrease quantity"
                            className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold tabular-nums text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.size, 1)
                            }
                            aria-label="Increase quantity"
                            className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold text-stone-900 tabular-nums">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form
                id="cod-checkout-form"
                onSubmit={handlePlaceCodOrder}
                className="pt-4 border-t border-stone-200 space-y-3"
              >
                <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                  Cash on Delivery Details
                </p>
                {formError && (
                  <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {formError}
                  </p>
                )}
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full Name"
                  aria-label="Full Name"
                  className="w-full px-3.5 py-2.5 text-sm rounded-md border border-stone-300 bg-white focus:border-stone-900 outline-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone (e.g. 0300-1234567)"
                    aria-label="Phone Number"
                    className="w-full px-3.5 py-2.5 text-sm rounded-md border border-stone-300 bg-white focus:border-stone-900 outline-none"
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    aria-label="City"
                    className="w-full px-3.5 py-2.5 text-sm rounded-md border border-stone-300 bg-white focus:border-stone-900 outline-none"
                  />
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street Address & House / Apartment No."
                  aria-label="Delivery Address"
                  className="w-full px-3.5 py-2.5 text-sm rounded-md border border-stone-300 bg-white focus:border-stone-900 outline-none"
                />
              </form>
            </>
          )}
        </div>

        {items.length > 0 && !confirmedOrder && (
          <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="tabular-nums">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {clearanceSavings > 0 && (
                <div className="flex justify-between text-[#9a5b13] font-medium">
                  <span>Clearance Savings</span>
                  <span className="tabular-nums">
                    - Rs. {clearanceSavings.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span className="tabular-nums">
                  {shippingFee === 0 ? 'Free' : `Rs. ${shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-stone-900 text-base pt-1.5 border-t border-stone-200">
                <span>Total</span>
                <span className="tabular-nums">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="submit"
                form="cod-checkout-form"
                className="w-full py-3 px-4 rounded-md bg-stone-900 text-white text-sm font-semibold hover:bg-[#b77a15] transition-colors cursor-pointer whitespace-nowrap"
              >
                Place Cash on Delivery Order
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-md border border-stone-300 bg-white text-stone-900 text-sm font-medium hover:bg-stone-100 transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-[#b77a15]" />
                Order via WhatsApp
              </a>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
