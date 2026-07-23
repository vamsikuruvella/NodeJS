import axios from "axios";
import { BASE_URL } from "./constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setConnections } from "../appStore/connectionStore";

const Connections = () => {
    const dispatch = useDispatch();
    const connections = useSelector((store) => store.connections);
    const fetchConnections= async () => {
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
    if(!connections || connections.length === 0) {
        return <div>....loading</div>
    }
    return (<div className="flex justify-center my-10">
    <h1 className="text-2xl font-bold">Connections</h1>
    </div>)
}
export default Connections