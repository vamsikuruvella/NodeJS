import { useState } from "react";
import axios from "axios";
import { addUser } from "../appStore/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./constants";
// import { useNavigate } from "react-router-dom";

const Login = () => {
    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setisLogin] = useState(true);
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [age, setage] = useState("");
    const [gender, setgender] = useState("");
    const [about, setabout] = useState("");
    const [skills, setskills] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [photoUrl, setPhotoUrl] = useState("https://picsum.photos/400/500");
    const [toastMsg, setToastMsg] = useState('test');
    const [toastType, setToastType] = useState("info");
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const local = true;
    // 'withCredentials:true' will show the tokens in browser console and also set the cookies in browser dev tools(application tab)
    const handleLogin = async (e) => {


        try {
            if (isLogin) {
                axios.post(BASE_URL + '/login', {
                    emailId: emailId,
                    password: password
                }, { withCredentials: true }
                )
                    .then((response) => {
                        console.log(response.data);
                        dispatch(addUser(response.data));
                        return navigate('/');
                    })
                    .catch((error) => {
                        console.error("Line 30: " + JSON.stringify(error.response));
                        setError(error.response.data);
                    });
            } else {

                if (firstName === "" ||
                    lastName === "" ||
                    emailId === "" ||
                    password === "" ||
                    age === "" ||
                    gender === "" ||
                    about === "" ||
                    skills.length === 0) {
                    setError("Please populate all the fields");
                    setTimeout(() => {
                        setError("");
                    }, 3000);
                    return;
                }
                const res = await axios.post(BASE_URL + "/signup", {
                    "firstName": firstName,
                    "lastName": lastName,
                    "emailId": emailId,
                    "password": password,
                    "age": age,
                    "gender": gender,
                    "skills": skills,
                    "about": about,
                    "photoUrl": photoUrl,
                }, {
                    withCredentials: true
                })
                dispatch(addUser(res.data.data));
                setisLogin(true);
                setToastMsg("User Created Successfully");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                return navigate("/");
            }
        } catch (err) {
            console.log("Login or sign up error: " + err);
        }

    }
    return <div className="flex justify-center items-center py-10 ">
        <div className="card bg-base-100 w-96 shadow-sm ">
            <div className="card-body p-[10px]">


                <fieldset className="fieldset py-2 pr-2 pl-2 flex items-center flex-col rounded-box bg-base-300">
                    <h2 className="card-title justify-center">{isLogin ? "Login" : "Sign Up"}</h2>

                    {!isLogin && <><div>
                        <legend className="fieldset-legend mb-1 text-2">First Name</legend>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setfirstName(e.target.value)}
                            className="input w-70 mb-[20px]"
                            placeholder=" "
                        />
                    </div>

                        <div>
                            <legend className="fieldset-legend mb-1 text-1">Last Name</legend>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setlastName(e.target.value)}
                                className="input w-70 mb-[20px]"
                                placeholder=" "
                            />
                        </div>

                        <div>
                            <legend className="fieldset-legend mb-1 text-1">Age</legend>
                            <input
                                type="text"
                                value={age}
                                onChange={(e) => setage(e.target.value)}
                                className="input w-70 mb-[20px]"
                                placeholder=" "
                            />
                        </div>

                        <div>
                            <legend className="fieldset-legend mb-1 text-1">Gender</legend>
                            <input
                                type="text"
                                value={gender}
                                onChange={(e) => setgender(e.target.value)}
                                className="input w-70 mb-[20px]"
                                placeholder=" "
                            />
                        </div>

                        <div>
                            <legend className="fieldset-legend mb-1 text-1">About</legend>
                            <input
                                type="text"
                                value={about}
                                onChange={(e) => setabout(e.target.value)}
                                className="input w-70 mb-[20px]"
                                placeholder=" "
                            />
                        </div>

                        < div>
                            <legend className="fieldset-legend mb-1 text-1">Skills</legend>
                            <input
                                type="text"
                                value={skills}
                                onChange={(e) => setskills(e.target.value.split(","))}
                                className="input w-70 mb-[20px]"
                                placeholder=" "
                            />
                        </div>
                    </>}

                    <div>
                        <legend className="fieldset-legend mb-1 text-1">Email ID:</legend>
                        <input
                            type="text"
                            value={emailId}
                            onChange={(e) => setEmailId(e.target.value)}
                            className="input w-70 mb-[20px]"
                            placeholder=" "
                        />
                    </div>

                    <div>
                        <legend className="fieldset-legend mb-1 text-1">Password</legend>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input w-70"
                            placeholder=""
                        />
                    </div>
                    <br></br>
                    <p className="text-error">{error}</p>
                    <p className="link link-hover" onClick={() => setisLogin((value) => !value)}>New User?</p>
                    <div className="card-actions justify-center w-full mt-4">
                        <button className="btn btn-primary" onClick={handleLogin}>{isLogin ? "Login" : "Sign Up"}</button>
                    </div>


                </fieldset>



            </div>
        </div>
        {showToast && (
            <div className="toast toast-top toast-center">
                <div className={`alert bg-accent`}>
                    <span>{toastMsg}</span>
                </div>
            </div>
        )}
    </div>
}

export default Login