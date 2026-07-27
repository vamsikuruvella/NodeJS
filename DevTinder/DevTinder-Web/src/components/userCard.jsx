import axios from "axios";
import { BASE_URL } from "./constants";
import { useDispatch } from "react-redux";
import { removeSpecificFeed } from "../appStore/feedSlice"

const UserCard = ({ user }) => {
    const { _id, firstName, lastName, about, photoUrl, age, gender, preview } = user || {};
    gender ? gender.toUpperCase() : "";
    const dispatch = useDispatch();

    const handSEndRequest = async (status, userId) => {
        try {
            const res = await axios.post(BASE_URL + "/request/send/" + status + "/" + userId, {}, {
                withCredentials: true,
            });
            dispatch(removeSpecificFeed(userId));
        } catch (err) {
            console.log("User Card Error: " + err);
        }
    }
    return (
        user && <div className="flex justify-center">

            <div className="card bg-base-300 w-[20rem] h-[40rem]  shadow-sm">

                <figure>
                    <img
                        src={photoUrl}
                        alt="Image" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">{firstName + " " + lastName}</h2>
                    <div>{age && <p> {age}</p>}
                        {gender && <p> {gender}</p>}
                        {about && <p>{about}</p>}</div>
                    <div className="card-actions justify-center">
                        <button className="btn btn-primary" onClick={() => handSEndRequest("ignore", _id)}>Ignore</button>
                        <button className="btn btn-secondary" onClick={() => handSEndRequest("interested", _id)}>Interested</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserCard;