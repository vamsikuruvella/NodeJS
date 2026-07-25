import axios from "axios";
import { BASE_URL } from "./constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setConnections } from "../appStore/connectionSlice";

const Connections = () => {
    const dispatch = useDispatch();
    const connections = useSelector((store) => store.connections);
    const fetchConnections = async () => {
        try {

            console.log("line 6: connections " + JSON.stringify(connections.length));
            if (connections.length > 0) return;
            const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
            console.log("line 7: connections " + JSON.stringify(res.data));
            dispatch(setConnections(res.data));

        } catch (error) {
            console.error("Error fetching connections:", error);
        }
    }

    useEffect(() => {
        fetchConnections();
    }, []);
    if (!connections) {
        return <div>....loading</div>
    }
    if (connections.length === 0) {
        return <div>No connections found.</div>
    }
    return (<div className="flex justify-center ">
        <div >
            <div className="flex justify-center"><h1 className="text-4xl">Connections</h1></div>

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

                        </div>
                        
                    </div>
                );
            })}
        </div>

    </div>)
}
export default Connections