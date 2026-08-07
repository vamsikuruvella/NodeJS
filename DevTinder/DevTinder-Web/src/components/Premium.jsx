import React, { useState } from "react";
import { BASE_URL } from "./constants";
import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";


const Premium = () => {
    // Redirect to payment gateway or show payment modal
    const [isMonthly, setIsMonthly] = useState(true);
    
    const user = useSelector((store) => store.user.user);
    const isUserPremium = user?.isPremium;

    

    const paymentVerify = async (response) => {
        try {
            if(isUserPremium) {
                alert("You are already a premium member.");
                return;
            }
            const res = await axios.get(`${BASE_URL}/payment/verify`, {
                withCredentials: true
            });
            console.log(res.data);
            if(res.data.isPremium) {
                alert("Payment Successful! You are now a premium member.");
                setIsUserPremium(true);
            }else{
                alert("Payment verification failed. Please contact support.");
            }
        } catch (err) {
            console.error("Error verifying payment:", err);
            alert("Payment verification failed. Please contact support.");
        }
    }

    const handlePayment = async (plan, isMonthly) => {
        // Implementation for handling payment
        console.log(`Initiating payment for ${plan} plan`);
        // You can integrate with a payment gateway here
        const res = await axios.post(`${BASE_URL}/payment/create`, {
            plan, isMonthly
        }, {
            withCredentials: true
        });
        console.log(res.data);

        const {amount, currency, orderId, key_id, userId} = res.data;
        // Open Razorpay Checkout
        const options = {
            key: key_id, // Replace with your Razorpay key_id
            amount: amount, // Amount is in currency subunits.
            currency: currency,
            name: 'Dev Tinder Premium',
            description: 'Connect with developers and unlock premium features',
            order_id: orderId, // This is the order_id created in the backend
            prefill: {
                name: userId.firstName+" "+userId.lastName,
                email: userId.emailId,
            },
            theme: {
                color: '#F37254'
            },
            handler: paymentVerify
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    
    if(!user) {
        return <div>Loading...</div>;
    }
    return isUserPremium ? (
        <div>
            <div>
                <h1 className="text-4xl font-bold text-center mt-10">You are a Premium Member</h1>
                <p className="text-center mt-4">Thank you for choosing our premium subscription.</p>
            </div>
        </div>
    ) : (
        <div>
            <div>
                <h1 className="text-4xl font-bold text-center mt-10">Upgrade to Premium</h1>
                <p className="text-center mt-4">Unlock exclusive features and enhance your experience with our premium subscription.</p>
                <div className="flex justify-center mt-4">
                    <input
                        type="checkbox"
                        value="synthwave"
                        className="toggle"
                        checked={!isMonthly}
                        onChange={() => setIsMonthly(!isMonthly)}
                    />
                    <p className="ml-2">{isMonthly ? "Monthly" : "Yearly"}</p>
                </div>
            </div>
            <div className="flex justify-center mt-10">
                <div className="card w-96 bg-base-300 shadow-sm m-2">
                    <div className="card-body">

                        <div className="flex justify-between items-start">
                            <h2 className="text-3xl font-bold">Basic</h2>

                            <div className="text-right">
                                <span className="text-xl">
                                    {isMonthly ? "₹100/mo" : "₹1000/yr"}
                                </span>

                                {!isMonthly && (
                                    <p className="text-success text-sm font-medium">
                                        Save ₹200
                                    </p>
                                )}
                            </div>
                        </div>
                        <ul className="mt-6 flex flex-col gap-2 text-sm">
                            <li>
                                ✓ Send up to 10 connection requests per day
                            </li>

                            <li>
                                ✓ View unlimited developer profiles
                            </li>

                            <li>
                                ✓ See who viewed your profile (last 5 visitors)
                            </li>

                            <li>
                                ✓ Basic profile visibility in Discover
                            </li>

                            <li>
                                ✓ Priority email support
                            </li>
                        </ul>
                        <div className="mt-6">
                            <button className="btn btn-primary btn-block" onClick={() => handlePayment(`basic`, isMonthly)}>Subscribe</button>
                        </div>
                    </div>
                </div>
                <div className="card w-96 bg-base-300 shadow-sm m-2">
                    <div className="card-body">

                        <div className="flex justify-between items-start">
                            <h2 className="text-3xl font-bold">Pro</h2>

                            <div className="text-right">
                                <span className="text-xl">
                                    {isMonthly ? "₹350/mo" : "₹3500/yr"}
                                </span>

                                {!isMonthly && (
                                    <p className="text-success text-sm font-medium">
                                        Save ₹700
                                    </p>
                                )}
                            </div>
                        </div>
                        <ul className="mt-6 flex flex-col gap-2 text-sm">
                            <li>
                                ✓ Unlimited connection requests
                            </li>

                            <li>
                                ✓ See everyone who viewed your profile
                            </li>

                            <li>
                                ✓ Priority profile visibility in Discover
                            </li>

                            <li>
                                ✓ Advanced developer search & filters
                            </li>

                            <li>
                                ✓ Premium badge on your profile
                            </li>
                        </ul>
                        <div className="mt-6">
                            <button className="btn btn-primary btn-block" onClick={() => handlePayment(`pro`, isMonthly)}>Subscribe</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Premium