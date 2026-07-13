import { Outlet } from 'react-router-dom'
import Navbar from './NavBar'
import Footer from './footer'
import axios from 'axios'
import { BASE_URL } from './constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../appStore/userSlice';
import { useEffect } from 'react';
const Body = () => {
    try{const dispatch = useDispatch();

    console.log("Body rendered");

    const fetchUser = async () => {
        console.log("fetchUser called");

        try {
            const res = await axios.get(
                BASE_URL + "/profile/view",
                { withCredentials: true }
            );

            console.log("Response:", res.data);
            dispatch(addUser(res.data));
        } catch (err) {
            console.log("Error:", err);
        }
    };

    useEffect(() => {
        console.log("useEffect ran");
        fetchUser();
    }, []);

    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );}catch(err){
        console.log("Error in Body component:", err);
        return (
            <>
                <Navbar />
                <Outlet />
                <Footer />
            </>
        );
    }
};

export default Body