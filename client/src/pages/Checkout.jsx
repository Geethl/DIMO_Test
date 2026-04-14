import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { clearCart } from '../features/cart/cartSlice';
import api from '../services/api';

// Normally, this comes from ENV variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder_key_replace_me');

const CheckoutForm = ({ clientSecret, orderItems, totalPrice, userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      }
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      toast.error(stripeError.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        await api.post('/orders', {
          orderItems,
          totalPrice,
          paymentId: paymentIntent.id,
          userId
        });
        
        toast.success('Payment successful! Order placed.', { icon: '🎉' });
        dispatch(clearCart());
        navigate('/profile');
      } catch (err) {
        toast.error('Payment succeeded but order creation failed.');
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
          },
        }} />
      </div>
      
      {error && <div className="text-red-500 flex items-center space-x-2"><AlertCircle size={16} /><span>{error}</span></div>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-dimo-blue hover:bg-blue-800 text-white font-bold py-4 rounded-xl flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
      >
        {processing ? <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" /> : (
          <>
            <Lock size={20} />
            <span>Pay Rs {totalPrice.toLocaleString()} Securely</span>
          </>
        )}
      </button>
    </form>
  );
};

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState('');
  const { cartItems } = useSelector(state => state.cart);
  const { userInfo } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    const getPaymentIntent = async () => {
      try {
        const { data } = await api.post('/orders/create-payment-intent', { orderItems: cartItems });
        setClientSecret(data.clientSecret);
      } catch (error) {
        toast.error('Failed to initialize payment.');
      }
    };
    getPaymentIntent();
  }, [cartItems, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
          <h2 className="text-2xl font-black text-dimo-dark dark:text-white mb-6 flex items-center gap-2">
            <CheckCircle className="text-dimo-blue" /> Order Summary
          </h2>
          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
            {cartItems.map(item => (
              <div key={item._id} className="flex justify-between items-center text-sm border-b border-gray-50 dark:border-gray-700 pb-2">
                <span className="text-gray-600 dark:text-gray-300 font-medium">{item.qty}x {item.name}</span>
                <span className="font-bold text-dimo-dark dark:text-white">Rs {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-center text-xl font-black">
            <span className="text-dimo-dark dark:text-white">Total</span>
            <span className="text-dimo-blue dark:text-blue-400">Rs {totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-black text-dimo-dark dark:text-white mb-6 flex items-center gap-2">
            <CreditCard className="text-dimo-blue" /> Payment Details
          </h2>
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm clientSecret={clientSecret} orderItems={cartItems} totalPrice={totalPrice} userId={userInfo?._id} />
            </Elements>
          ) : (
             <div className="flex justify-center p-10"><div className="animate-spin text-dimo-blue w-10 h-10 border-4 border-t-transparent rounded-full" /></div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Checkout;
