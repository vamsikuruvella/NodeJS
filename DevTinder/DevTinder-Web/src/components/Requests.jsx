import axios from "axios";
import { BASE_URL } from "./constants";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addRequests, removeRequest } from "../appStore/requestSlice"

const Requests = () => {
    const requests = useSelector((store) => store.requests);
    const [showBtn, setshowBtn] = useState(true);
    const dispatch = useDispatch();

    const reviewRequest = async (status, id) => {
        try {
            if (status === "accepted" || status === "rejected") {
                const res = await axios.post(BASE_URL + "/request/review/" + status + "/" + id,{}, {
                    withCredentials: true
                });
                dispatch(removeRequest(id));
            } else {
                throw new Error("Invalid Request action")
            }
        } catch (err) {
            console.error("Error reviewing request:", err);
        }
    }

    const fetchRequests = async () => {
        console.log("fetchRequests called " + BASE_URL + "/user/requests/received");
        try {
            console.log("line 5: requests " + BASE_URL + "/user/requests/received");
            // if (requests != null) return;
            const res = await axios.get(BASE_URL + "/user/requests/received", {
                withCredentials: true
            })
            console.log("line 6: requests " + JSON.stringify(res.data));
            dispatch(addRequests(res.data.data));

        } catch (err) {
            console.error("Error fetching requests:", err);
        }
    }

    useEffect(() => {
        fetchRequests()
    }, []);

    
    if (!requests || requests.length === 0) {
        return <div>No requests found.</div>
    }
    return (<div className="flex justify-center ">
        <div >
            <div className="flex justify-center"><h1 className="text-4xl">Requests</h1></div>

            {requests.map((Request) => {
                const { _id } = Request;
                const { firstName, lastName, emailId, about, age, gender, photoUrl } = Request.fromUserId;

                return (
                    <div key={_id} className="flex m-4 justify-between items-center p-4 rounded-lg bg-base-300" >
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
                        {showBtn && <div>
                            <button className="btn btn-primary mt-4" onClick={()=>reviewRequest('rejected',_id)}>Reject</button>
                            <button className="btn btn-success mt-4 ml-2" onClick={()=>reviewRequest('accepted',_id)}>Accept</button>
                        </div>}
                    </div>
                );
            })}
        </div>

    </div>)
}
export default Requests