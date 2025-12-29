"use client";

import { useState } from 'react';
import { useCart } from '@/components/providers/CartContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Image from 'next/image';
import { Trash2, Home } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    const payload = {
      customer_info: customerInfo,
      items: cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch('http://localhost:8000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Order placed successfully!');
        clearCart();
        setCustomerInfo({ name: '', phone: '', email: '', address: '' });
      } else {
        const errorData = await response.json();
        toast.error(`Failed to place order: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred while submitting your order.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 top-700">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <Link href="/" className="text-[#FF6B00] hover:text-[#FF6B00]/80 transition-colors">
          <Home size={24} />
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Customer Information Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Customer Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={customerInfo.name}
                onChange={handleInputChange}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={customerInfo.phone}
                onChange={handleInputChange}
                placeholder="123-456-7890"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={customerInfo.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <Input
                id="address"
                name="address"
                type="text"
                required
                value={customerInfo.address}
                onChange={handleInputChange}
                placeholder="1234 Main St, Anytown, USA"
              />
            </div>
            <Button type="submit" className="w-full">
              Place Order
            </Button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg text-gray-700">
          <h2 className="text-2xl font-semibold mb-6 ">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={item.product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.product.imageUrl || '/placeholder.svg'}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                     <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                        <Trash2 className="h-5 w-5 text-red-500" />
                     </Button>
                  </div>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>
          <div className="border-t mt-6 pt-6">
            <div className="flex justify-between items-center text-lg font-bold">
              <p>Total</p>
              <p>{calculateTotal()} VND</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
