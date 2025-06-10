import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
  const [rupee, setRupee] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState(0);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const makePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const { data: order } = await axios.post(
      "http://localhost:5000/payment/create-order",
      {
        amount: rupee, // amount in INR
      }
    );

    console.log("Order: " + JSON.stringify(order));

    const options = {
      key: import.meta.env.VITE_RAZORPAY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "TalkyTalk",
      description: "Welcome to TalkyTalk",
      order_id: order.id,
      handler: function (response) {
        alert("Payment successful!");
        console.log(response);
      },
      prefill: {
        name,
        email,
        contact,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="flex gap-6 flex-col">
      <h1 className="text-6xl font-bold text-center text-blue-600 ">
        Payment Page
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          makePayment();
        }}
        className="flex flex-col gap-2 justify-center items-center "
      >
        <input
          type="text"
          className="border-2 border-black"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          className="border-2 border-black"
          placeholder="Enter amount"
          value={rupee}
          onChange={(e) => setRupee(e.target.value)}
        />
        <input
          type="text"
          className="border-2 border-black"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="number"
          className="border-2 border-black"
          placeholder="Enter Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <button type="submit" className="border-2 border-black">
          Pay
        </button>
      </form>
    </div>
  );
};

export default Payment;
