import { Outlet } from 'react-router-dom'
import Navbar from './NavBar'
import Footer from './footer'
import axios from 'axios'
import { BASE_URL } from './constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../appStore/userSlice';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const Body = () => {
    console.log("Body rendered");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.user);

    const fetchUser = async () => {
        try {
            if (userData.user) {
                return;
            }
            const res = await axios.get(
                BASE_URL + "/profile/view",
                { withCredentials: true }
            );
            dispatch(addUser(res.data));
        } catch (err) {
            console.log("Error fetchUser: "+err);
            if (err.status === 400 || err.status === 401) {
                navigate("/login");
            }
        }
    };

    useEffect(() => {
        console.log("Body useEffect");
        fetchUser();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default Body