import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "./constants";
import { addUser } from "../appStore/userSlice";

const Profile = () => {
    console.log("Profile rendered");
    const user = useSelector((store) => store.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.user);

    const fetchUser = async () => {
        console.log("fetchUser called");
        try {
            if (userData.user) {
                return;
            }
            const res = await axios.get(
                BASE_URL + "/profile/view",
                { withCredentials: true }
            );
            console.log("Response:", res.data);
            dispatch(addUser(res.data));
        } catch (err) {
            console.log(err);
            if (err.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    useEffect(() => {
        console.log("profile useEffect");
        
        fetchUser();
    }, []);
    //Very necessary check to avoid the error "Cannot read properties of null (reading 'firstName')" when the user is not yet fetched from the backend. This is because the component will render before the user data is fetched, and if we try to access user.firstName before the user data is available, it will throw an error. So we need to check if the user data is available before rendering the EditProfile component.
    if(!user) {
        return <div>Loading...</div>;
    }
    return<>
        <EditProfile user = {user}/>
    </>
}

export default Profile