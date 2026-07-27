import { BASE_URL } from "./constants";
import { useDispatch } from "react-redux";
import { setFeed } from "../appStore/feedSlice";
import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import UserCard from "./userCard";

function Feed() {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const getFeed = async () => {
    try {
      if (feed && feed.length > 0) return;
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      console.log("line 16: " + JSON.stringify(res.data));
      dispatch(setFeed(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);
  if(!feed) return;
  if(feed.length<=0) return <h1 className="flex justify-center my-10">No New User Found</h1>
  return (feed && <div >
    <UserCard user={feed[0]} />
  </div>);
}

export default Feed;