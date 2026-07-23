import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUser } from "../appStore/userSlice";

const NavBar = () => {
    const store = useSelector((state) => state);
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    console.log(store);
    const user = useSelector((store) => store.user.user);
    console.log("user in navbar", user);
    console.log(user);
    console.log(!!user);
    console.log(typeof user);
    const handleLogout = async () => {
        try {
            const res = await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
            dispatch(removeUser());
            Navigate("/login");
        }
        catch (err) {
            console.log(err);
        }
    }
    return <>
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">👦 DevTinder</Link>
            </div>
            <div className="flex gap-1">
                <p className="px-4 py-4">Welcome, {user?.firstName || "User"}!</p>
                <div className="dropdown dropdown-end mt-2 mr-5">


                    {user && (<div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src={user.photoUrl} />
                        </div>
                    </div>
                    )}
                    <div tabIndex="-1"
                        className="menu menu-lg dropdown-content bg-base-900 rounded-box z-1 mt-3 w-80 p-4 shadow">
                        <ul>
                            <li>
                                <Link to="/profile" className="">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/connections" className="">
                                    Connections
                                </Link>
                            </li>
                            <li>
                                <Link to="/requests" className="">
                                    Requests
                                </Link>
                            </li>
                            <li><a onClick={handleLogout}>Logout</a></li>
                        </ul></div>

                </div>
            </div>
        </div></>

}
export default NavBar;