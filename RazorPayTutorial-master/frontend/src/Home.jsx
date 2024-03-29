import React from 'react'
import { Box, Stack } from "@chakra-ui/react"
import Card from './Card'
import axios from "axios";


const Home = () => {
let response;

    const checkoutHandler = async (amount) => {
        try {
        //  const { data: { key } } = await axios.get("http://www.localhost:4000/api/getkey")
        response = await axios.get("http://localhost:4000/api/getkey");
        const key = response.data.key;

          
        //  const { data: { order } } = await axios.post("http://localhost:4000/api/checkout", {
        //      amount
        // })
        response = await axios.post("http://localhost:4000/api/checkout", {
  amount
});

const order = response.data.order;
console.log(order);
      


        const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: "XpertConsult",
            description: "Tutorial of RazorPay",
            image: "https://cdn1.vectorstock.com/i/1000x1000/39/55/expert-advice-consulting-service-business-help-vector-20513955.jpg",
            order_id: order.id,
            callback_url: "http://localhost:4000/api/paymentverification",
            // prefill: {
            //     name: "Gaurav Kumar",
            //     email: "gaurav.kumar@example.com",
            //     contact: "9999999999"
            // },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#3B82D9"
            }
        };
        const razor = new window.Razorpay(options);
        razor.open();}catch (error) {
            // Handle the error here
            console.error("Error in checkoutHandler:", error);}
    }

    return (
        <Box>

            <Stack h={"100vh"} alignItems="center" justifyContent="center" direction={["column", "row"]}>

                <Card amount={5000} img={"https://cdn.shopify.com/s/files/1/1684/4603/products/MacBookPro13_Mid2012_NonRetina_Silver.png"} checkoutHandler={checkoutHandler} />
                <Card amount={3000} img={"http://i1.adis.ws/i/canon/eos-r5_front_rf24-105mmf4lisusm_32c26ad194234d42b3cd9e582a21c99b"} checkoutHandler={checkoutHandler} />

            </Stack>
        </Box>
    )
}

export default Home