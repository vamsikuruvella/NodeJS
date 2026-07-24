import axios from "axios";
import { BASE_URL } from "./constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addRequests, removeRequests } from "../appStore/requestSlice"

const Requests = () => {
    const requests = useSelector((store) => store.requests);
    const dispatch = useDispatch();
    const fetchRequests = async () => {
        try {
            if (requests != null) return;
            const res = axios.get(BASE_URL + "user/requests/received", {
                withCredentials: true
            })
            dispatch(addRequests(res.data.data));

        } catch (err) {

        }
    }

    useEffect(() => {
        fetchRequests()
    }, []);

    if (!requests) {
        return <div>....loading</div>
    }
    if (connections.length === 0) {
        return <div>No connections found.</div>
    }
    return (<div className="flex justify-center ">
        <div >
            <div className="flex justify-center"><h1 className="text-4xl">Requests</h1></div>

            {requests.map((Request) => {
                const { firstName, lastName, emailId, about, age, gender, photoUrl } = Request;

                return (
                    <div className="flex m-4 p-4 rounded-lg bg-base-300" >
                        <div><img src={photoUrl} alt="Profile" className="w-48 h-48 object-cover rounded-full" /></div>
                        <div className="mx-4 text-left">
                            <h2 className="text-xl font-bold">
                                {firstName} {lastName}
                            </h2>
                            <p> {emailId}</p>
                            {age && gender && (
                                <p> {age} , {gender}</p>
                            )}
                            <p>{about}</p>

                        </div>
                    </div>
                );
            })}
        </div>

    </div>)
}
export default Requests