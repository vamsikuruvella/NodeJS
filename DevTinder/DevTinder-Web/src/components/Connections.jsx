import axios from "axios";
import { BASE_URL } from "./constants";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setConnections } from "../appStore/connectionSlice";
import CallWin from "./CallWin";

const Connections = () => {
    const dispatch = useDispatch();
    const connections = useSelector((store) => store.connections);
    const User = useSelector((store) => store.user);
    const [isPremium, setisPremium] = useState(false);
    // const [callWindow, showcallWindow] = useState(false);
    const [toUserObj, settoUserObj] = useState(null);
    const fetchConnections = async () => {
        try {

            console.log("User:", User);

            // Wait until user data is available
            if (!User?.user) {
                return;
            }
            setisPremium(User.user.isPremium);
            if (connections.length > 0) return;

            console.log("Is premuim user: " + JSON.stringify(User.isPremium));
            const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
            console.log("line 7: connections " + JSON.stringify(res.data));
            dispatch(setConnections(res.data));

        } catch (error) {
            console.error("Error fetching connections:", error);
        }
    }

    useEffect(() => {
        fetchConnections();
    }, [User, connections]);
    if (!connections) {
        return <div>....loading</div>
    }
    if (connections.length === 0) {
        return <div>No connections found.</div>
    }
    if (connections?.message === "No connections") {
        return (
            <div className="flex justify-center my-10">
                <h1>No Connections Found</h1>
            </div>
        );
    }
    const showcallPopup = (id, connection) => {
        // showcallWindow(true);
        settoUserObj(connection);
        // document.getElementById("modal_dialog").showModal();
    }
    return (<div className="flex justify-center ">
        <div >
            <div className="flex justify-center"><h1 className="text-4xl">Connections</h1></div>
            {toUserObj && (
                <dialog open className="modal">
                    <div className="modal-box w-11/12 h-6/10 max-w-5xl">
                        <CallWin
                            fromUser={User.user}
                            toUser={toUserObj}
                            onHangUp={() => settoUserObj(null)}
                        />
                    </div>
                </dialog>
            )}
            {connections.map((connection) => {
                const { _id, firstName, lastName, emailId, about, age, gender, photoUrl } = connection;

                return (
                    <div key={_id} className="flex m-4 p-4 rounded-lg bg-base-300" >
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
                            <button className="btn btn-primary m-2" onClick={() => window.location.href = `/chat/${_id}`}>Chat</button>
                            {isPremium && (<><button className="btn btn-primary m-2" onClick={() => showcallPopup(_id, connection)}>Call</button>
                            </>)}
                        </div>

                    </div>
                );
            })}
        </div>

    </div>)
}
export default Connections