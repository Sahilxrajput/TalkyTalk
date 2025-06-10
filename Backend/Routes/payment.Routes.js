const Razorpay = require("razorpay");
const router = require("express").Router();

const razorpay = new Razorpay({
  key_id: process.env.TEST_KEY_ID,
  key_secret: process.env.TEST_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
    console.log(order)
  } catch (error) {
    console.log(error)
    res.status(500).send("Something went wrong"); // server.js or routes/payment.js
  }
});

module.exports = router;
