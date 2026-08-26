import { useEffect, useRef } from "react";
import phoneIcon from "../assets/phone-down-svgrepo-com.svg";
import phoneAnswerIcon from "../assets/telephone.png";

const Callincoming = ({
    fromUser,
    localStream,
    remoteStream,
    onAnswer,
    onReject
}) => {

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const {
        firstName,
        lastName,
        emailId
    } = fromUser;

    // Remote video
    useEffect(() => {
        if (!remoteVideoRef.current || !remoteStream) return;

        console.log("🎥 Setting incoming remote stream");

        remoteVideoRef.current.srcObject = remoteStream;

    }, [remoteStream]);

    // Local video
    useEffect(() => {
        if (!localVideoRef.current || !localStream) return;

        console.log("🎥 Setting incoming local stream");

        localVideoRef.current.srcObject = localStream;

    }, [localStream]);

    return (
        <div>

            <h3 className="font-bold text-lg">
                Incoming call
            </h3>

            <div className="flex flex-col items-center">

                <p className="m-1">
                    {firstName} {lastName}
                </p>

                <p className="m-1">
                    {emailId}
                </p>

                {/* Remote user's video */}
                {remoteStream && (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-80 rounded-box bg-black"
                    />
                )}

                {/* Our video */}
                {localStream && (
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-80 rounded-box bg-black"
                    />
                )}

            </div>

            <div className="modal-action">

                <button
                    type="button"
                    className="btn btn-active btn-success m-1"
                    onClick={onAnswer}
                >
                    <img
                        src={phoneAnswerIcon}
                        alt="Answer"
                        className="w-6 h-6"
                    />
                </button>

                <button
                    type="button"
                    className="btn btn-active btn-error m-1"
                    onClick={onReject}
                >
                    <img
                        src={phoneIcon}
                        alt="Reject"
                        className="w-6 h-6"
                    />
                </button>

            </div>

        </div>
    );
};

export default Callincoming;