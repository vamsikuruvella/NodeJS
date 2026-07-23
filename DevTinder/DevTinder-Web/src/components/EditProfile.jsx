import { useState } from "react";
import axios from "axios";
import { addUser } from "../appStore/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./constants";
import UserCard from "./userCard";
const EditProfile = ({ user }) => {
    const [firstName, setFirstName] = useState(user.firstName || '');
    const [lastName, setLastName] = useState(user.lastName || '');
    const [photoUrl, setPhotoUrl] = useState(user.photoUrl || '');
    const [gender, setGender] = useState(user.gender || '');
    const [age, setAge] = useState(user.age || '');
    const [about, setAbout] = useState(user.about || '');
    const [skills, setSkills] = useState(user.skills || '');
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState("info"); // info, success, error, warning
    const [preview, setPreview] = useState(user.preview || true);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 'withCredentials:true' will show the tokens in browser console and also set the cookies in browser dev tools(application tab)
    const saveProfile = async (e) => {
        try {
            const res = await axios.patch(BASE_URL + "/profile/edit", {
                firstName,
                lastName,
                photoUrl,
                age,
                gender,
                skills,
                about,
            }, { withCredentials: true });
            console.log("Profile saved successfully:", res.data);
            dispatch(addUser(res?.data?.data));
            setToastMsg("Profile saved successfully");
            setShowToast(true);
            setToastType("success");
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
            navigate("/profile");
        } catch (err) {
            console.log(err);
            setToastMsg("Error: Failed to save profile");
            setShowToast(true);
            setToastType("warning");
            setTimeout(() => {
                setShowToast(false);
                setError('');
            }, 3000);
            setError(err.response.data || "An error occurred while saving the profile.");
        }
    }
    return <div className="flex justify-center items-start gap-12 p-8">
        <div className="flex justify-center items-center ">
            <div className="card bg-base-100 w-96 shadow-sm ">
                <div className="card-body p-2">


                    <fieldset className="fieldset py-4 pr-8 pl-8 rounded-box bg-base-300">
                        <h2 className="card-title justify-center">Edit Profile</h2>
                        <div>
                            <legend className="fieldset-legend mb-[5px] text-[15px]">First Name</legend>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="input w-full mb-[20px]"
                                placeholder=" "
                            />
                        </div>

                        <div>
                            <legend className="fieldset-legend mb-[5px] text-[15px]">Last Name</legend>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="input w-full mb-[20px]"
                                placeholder=" "
                            />
                        </div>

                        <div>
                            <legend className="fieldset-legend mb-[5px] text-[15px]">Photo URL</legend>
                            <input
                                type="text"
                                value={photoUrl}
                                onChange={(e) => setPhotoUrl(e.target.value)}
                                className="input w-full mb-[20px]"
                                placeholder=" "
                            />
                        </div>

                        <div>
                            <legend className="fieldset-legend mb-[5px] text-[15px]">Age</legend>
                            <input
                                type="text"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="input w-full mb-[20px]"
                                placeholder=" "
                            />
                        </div>

                        <div>
                            <legend className="fieldset-legend mb-[5px] text-[15px]">Gender</legend>
                            <input
                                type="text"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="input w-full mb-[20px]"
                                placeholder=" "
                            />
                        </div>

                        <div>
                            <legend className="fieldset-legend mb-[5px] text-[15px]">Skills</legend>
                            <input
                                type="text"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="input w-full mb-[20px]"
                                placeholder=" "
                            />
                        </div>

                        <div>
                            <legend className="fieldset-legend mb-[5px] text-[15px]">About</legend>
                            <input
                                type="text"
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                className="input w-full mb-[20px]"
                                placeholder=" "
                            />
                        </div>

                        <br></br>
                        <p className="text-error">{error}</p>
                        <div className="card-actions ml-[165px]">
                            <button className="btn btn-primary" onClick={saveProfile}>Save Profile</button>
                        </div>


                    </fieldset>



                </div>
            </div>
        </div>
        <div>
            <div ><p className="card-title  mt-10">Preview</p> </div>
            <UserCard user={{ firstName, lastName, photoUrl, age, gender, about, preview }} />
        </div>
        {showToast && (
            <div className="toast toast-top toast-center">
                <div className={`alert alert-${toastType}`}>
                    <span>{toastMsg}</span>
                </div>
            </div>
        )}
    </div>
}
export default EditProfile;