"use client"; // Ensure this is at the top

import React, { useState } from 'react';
import Script from 'next/script';

const PaymentPage = () => {
  const AMOUNT = 100; // Amount in INR
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // create order
      const response = await fetch('/api/create-order', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Order data:", data); // Log the order data

      //initialize razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: AMOUNT * 100,
        currency: "INR",
        name: "sagevedant",
        description: "Test Transaction",
        order_id: data.orderid,
        handler: async (response: any) => {
          console.log("Payment success", response);
          // handle payment success 
        },
        prefill: { 
          name: "sagevedant",
          email: "sagevedant@gmail.com",
          contact: "9876543210",
        },
        theme: {
          color: "#333",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Payment failed', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Payment Page</h1>
        <p className="mb-4"> Amount to pay: {AMOUNT} INR</p>
        <button 
          onClick={handlePayment} 
          disabled={isProcessing}
          className="bg-blue-500 text-white px-4 py-2 rounded-md">
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage; // Ensure you export the component  



 