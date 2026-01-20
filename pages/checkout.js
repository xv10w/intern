import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SiteContext, ContextProviderComponent } from '../context/mainContext';
import { useAuth } from '../context/authContext';
import DENOMINATION from '../utils/currencyProvider';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import Link from 'next/link';
import Image from '../components/Image';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import AddressAutocomplete from '../components/AddressAutocomplete';

function CheckoutWithContext(props) {
  return (
    <ContextProviderComponent>
      <SiteContext.Consumer>
        {(context) => <Checkout {...props} context={context} />}
      </SiteContext.Consumer>
    </ContextProviderComponent>
  );
}

const Input = ({ onChange, value, name, placeholder, type = 'text' }) => (
  <input
    onChange={onChange}
    value={value}
    className="mt-2 text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    type={type}
    placeholder={placeholder}
    name={name}
    required
  />
);

const Checkout = ({ context }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [input, setInput] = useState({
    name: user?.name || '',
    email: user?.email || '',
    street: '',
    city: '',
    postal_code: '',
    state: '',
  });

  const onChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = (addressComponents) => {
    setInput({
      ...input,
      street: addressComponents.street,
      city: addressComponents.city,
      state: addressComponents.state,
      postal_code: addressComponents.postal_code,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      router.push('/login');
      return;
    }

    const { name, email, street, city, postal_code, state } = input;
    const { total, cart, clearCart } = context;

    // Validate input
    if (!street || !city || !postal_code || !state) {
      toast.error('Please fill in all address fields');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        items: cart.map((item) => ({
          product: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image,
        })),
        totalAmount: total,
        shippingAddress: {
          name,
          email,
          address: `${street}, ${city}, ${state} - ${postal_code}`,
        },
        paymentMethod: 'UPI',
      };

      // Create order
      const response = await axios.post('/api/orders', orderData);

      if (response.data.success) {
        const orderId = response.data.order._id;
        clearCart();
        toast.success('Order created! Redirecting to payment...');

        // Redirect to payment page
        setTimeout(() => {
          router.push(`/payment?orderId=${orderId}`);
        }, 1000);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      const message = error.response?.data?.message || 'Failed to create order';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const { numberOfItemsInCart, cart, total } = context;
  const cartEmpty = numberOfItemsInCart === Number(0);

  return (
    <div className="flex flex-col items-center pb-10">
      <Head>
        <title>Next.js Store - Checkout</title>
        <meta name="description" content="Next.js Store Checkout" />
        <meta property="og:title" content="Next.js Store - Checkout" key="title" />
      </Head>
      <div className="flex flex-col w-full c_large:w-c_large">
        <div className="pt-10 pb-8">
          <h1 className="text-5xl font-light mb-6">Checkout</h1>
          <Link href="/cart">
            <a aria-label="Cart">
              <div className="cursor-pointer flex items-center">
                <span className="mr-2 text-gray-600"><FaLongArrowAltLeft /></span>
                <p className="text-gray-600 text-sm">Edit Cart</p>
              </div>
            </a>
          </Link>
        </div>

        {cartEmpty ? (
          <h3>No items in cart.</h3>
        ) : (
          <div className="flex flex-col">
            <div>
              {cart.map((item, index) => (
                <div className="border-b py-10" key={index}>
                  <div className="flex items-center">
                    <Image className="w-32 m-0" src={item.image} alt={item.name} />
                    <p className="m-0 pl-10 text-gray-600">{item.name}</p>
                    <div className="flex flex-1 justify-end">
                      <p className="m-0 pl-10 text-gray-900 font-semibold">
                        {DENOMINATION + item.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-1 flex-col md:flex-row">
              <div className="flex flex-1 pt-8 flex-col">
                <div className="mt-4 border-t pt-10">
                  <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                  <form onSubmit={handleSubmit}>
                    <Input
                      onChange={onChange}
                      value={input.name}
                      name="name"
                      placeholder="Full Name"
                    />
                    <Input
                      onChange={onChange}
                      value={input.email}
                      name="email"
                      type="email"
                      placeholder="Email"
                    />
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-xs text-gray-500">(Start typing to search)</span>
                      </label>
                      <AddressAutocomplete
                        onAddressSelect={handleAddressSelect}
                        onChange={onChange}
                        defaultValue={input.street}
                      />
                    </div>
                    <Input
                      onChange={onChange}
                      value={input.city}
                      name="city"
                      placeholder="City"
                    />
                    <Input
                      onChange={onChange}
                      value={input.state}
                      name="state"
                      placeholder="State"
                    />
                    <Input
                      onChange={onChange}
                      value={input.postal_code}
                      name="postal_code"
                      placeholder="Postal Code"
                    />
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="hidden md:block bg-primary hover:bg-black text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                  </form>
                </div>
              </div>

              <div className="md:pt-20">
                <div className="pl-4 flex flex-1 pt-2 md:pt-8 mt-2 sm:mt-0">
                  <p className="text-sm pr-10 text-left">Subtotal</p>
                  <p className="w-38 flex text-right justify-end">{DENOMINATION + total}</p>
                </div>
                <div className="pl-4 flex flex-1 my-2">
                  <p className="text-sm pr-10">Shipping</p>
                  <p className="w-38 flex justify-end">FREE SHIPPING</p>
                </div>
                <div className="md:ml-4 pl-2 flex flex-1 bg-gray-200 pr-4 pb-1 pt-2 mt-2">
                  <p className="text-sm pr-10">Total</p>
                  <p className="font-semibold w-38 flex justify-end">{DENOMINATION + total}</p>
                </div>
                <div className="md:ml-4 pl-2 mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Payment Method:</strong> UPI
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  onClick={handleSubmit}
                  className="md:hidden bg-primary hover:bg-black text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed w-full"
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutWithContext;