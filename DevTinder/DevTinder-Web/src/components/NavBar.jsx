import { useSelector } from "react-redux";
const NavBar = () => {
    const store = useSelector((state) => state);
    console.log(store);
    const user = useSelector((store) => store.user.user);
    console.log("user in navbar", user);
    console.log(user);
    console.log(!!user);
    console.log(typeof user);
    return <>
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">👦 DevTinder</a>
            </div>
            <div className="flex gap-2">
                <p className="px-10 py-10">Welcome, {user?.firstName || "User"}!</p>
                <div className="dropdown dropdown-end mr-1 mx-5">
                    

                    {user && (<div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <img className="w-10 rounded-full"
                                alt="Tailwind CSS Navbar component"
                                src={user.photoUrl} />
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>)}
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div></>

}
export default NavBar;