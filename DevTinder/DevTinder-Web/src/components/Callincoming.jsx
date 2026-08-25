import { useState } from "react";
import { useSelector } from "react-redux";
import phoneIcon from "../assets/phone-down-svgrepo-com.svg";
import phoneAnswerIcon from "../assets/telephone.png"
import { fromJSON } from "postcss";
import { getPeerConnection,closePeerConnection } from "../appStore/peerConnection";
import CallWin from "./CallWin";


const Callincoming = ({ fromUser }) => {
    console.log("incoming call tag data " + JSON.stringify(fromUser));
    const { _id, firstName, lastName, emailId, about, age, gender, photoUrl } = fromUser;
    const [showCallWin, setshowCallWin] = useState(false);
    console.log("incoming call tag " + firstName);
    const hangUp = () => {
        closePeerConnection();
        return;
    };
    const answerCall = () => {
        setshowCallWin(true);
        return;
    };
    return <>
        {/* <div open className="toast">
            <dialog open className="modal"> */}
        {/* <div className="modal-box"> */}
        <div><h3 className="font-bold text-lg">Calling<span className="loading loading-dots loading-sm"></span></h3>
            <div className="flex flex-col items-center">
                <div className="avatar mt-10 ">
                    <div className="aura aura-rainbow w-24 rounded-full bg-base-100">
                        <img alt="Tailwind-CSS-Avatar-component" src={photoUrl} />
                    </div>
                </div>
                <p className="m-4">
                    {firstName}{" "}{lastName}
                </p>
                <div>

                </div>
            </div></div>
        <div className="modal-action">

            <form method="dialog">
                <button className="btn btn-active btn-success m-1" onClick={answerCall}>
                    <img
                        src={phoneAnswerIcon}
                        alt="Call"
                        className="w-6 h-6"
                    />
                </button>
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-active btn-error m-1" onClick={hangUp}>
                    <img
                        src={phoneIcon}
                        alt="Call"
                        className="w-6 h-6"
                    />
                </button>
            </form>
        </div>
        {/* </div> */}
        {/* </dialog>
        </div> */}
    </>
}

export default Callincoming;