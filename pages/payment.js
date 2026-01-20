import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';

export default function Payment() {
    const router = useRouter();
    const { orderId } = router.query;
    const { user, isAuthenticated } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [transactionId, setTransactionId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/api/orders/${orderId}`);
                if (response.data.success) {
                    setOrder(response.data.order);
                }
            } catch (error) {
                toast.error('Failed to load order details');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId, isAuthenticated, router]);

    const handlePaymentConfirmation = async () => {
        if (!transactionId.trim()) {
            toast.error('Please enter UPI transaction ID');
            return;
        }

        setIsProcessing(true);

        // In a real app, you would verify the transaction with UPI gateway
        // For now, we'll just simulate a successful payment
        setTimeout(() => {
            toast.success('Payment confirmed! Order placed successfully.');
            router.push('/');
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const upiId = 'merchant@upi'; // Replace with actual merchant UPI ID
    const amount = order.totalAmount;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head>
                <title>Next.js Store - Payment</title>
                <meta name="description" content="Complete your payment" />
            </Head>

            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">Complete Payment</h1>
                    </div>

                    {/* Order Summary */}
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order ID:</span>
                                <span className="font-medium">{order._id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Items:</span>
                                <span className="font-medium">{order.items.length}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total Amount:</span>
                                <span className="text-blue-600">₹{amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* UPI Payment Section */}
                    <div className="px-6 py-6">
                        <h2 className="text-lg font-semibold mb-4">Pay via UPI</h2>

                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <div className="text-center mb-4">
                                <div className="inline-block bg-white p-4 rounded-lg shadow">
                                    {/* QR Code Placeholder */}
                                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                                        <div className="text-center">
                                            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                            </svg>
                                            <p className="text-sm text-gray-500 mt-2">QR Code</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-4">Scan QR code with any UPI app</p>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-center justify-center space-x-2 mb-4">
                                    <span className="text-gray-600">UPI ID:</span>
                                    <code className="bg-white px-3 py-1 rounded border font-mono text-sm">
                                        {upiId}
                                    </code>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(upiId);
                                            toast.success('UPI ID copied!');
                                        }}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="text-center text-sm text-gray-600">
                                    <p>Amount to pay: <span className="font-bold text-lg text-blue-600">₹{amount}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Transaction ID Input */}
                        <div className="mb-6">
                            <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
                                Enter UPI Transaction ID / Reference Number
                            </label>
                            <input
                                type="text"
                                id="transactionId"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="e.g., 123456789012"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                After completing the payment, enter the transaction ID you received
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                            <button
                                onClick={handlePaymentConfirmation}
                                disabled={isProcessing}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Processing...' : 'Confirm Payment'}
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                        </div>

                        {/* Payment Instructions */}
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 mb-2">Payment Instructions:</h3>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                                <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                                <li>Scan the QR code or enter the UPI ID manually</li>
                                <li>Enter the exact amount: ₹{amount}</li>
                                <li>Complete the payment</li>
                                <li>Copy the transaction ID from your UPI app</li>
                                <li>Paste it above and click &quot;Confirm Payment&quot;</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
