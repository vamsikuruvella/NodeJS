import { Outlet } from 'react-router-dom'
import Navbar from './NavBar'
import Footer from './footer'
import axios from 'axios'
import { BASE_URL } from './constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../appStore/userSlice';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const res = await axios.get(
                BASE_URL + "/profile/view",
                { withCredentials: true }
            );

            dispatch(addUser(res.data));
        } catch (err) {
            console.log(err);
            if(err.status === 401) {
                navigate("/login");
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
};

export default Body