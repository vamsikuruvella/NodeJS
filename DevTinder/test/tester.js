const axios = require("axios");

const users = [
    {
        firstName: "Rakesh",
        lastName: "Mishra",
        emailId: "rakesh1@gmail.com",
        password: "Pass@123",
        age: 28,
        gender: "male",
        skills: ["java", "springboot", "mysql"],
        about: "Backend developer interested in scalable APIs."
    },
    {
        firstName: "Lavanya",
        lastName: "Reddy",
        emailId: "lavanya1@gmail.com",
        password: "Pass@123",
        age: 25,
        gender: "female",
        skills: ["react", "typescript", "redux"],
        about: "Frontend engineer building modern web applications."
    }
];

async function seedUsers() {
    for (const user of users) {
        try {
            const response = await axios.post(
                "http://localhost:3000/signup",
                user
            );

            console.log(`✅ Created ${user.firstName}`);
        } catch (err) {
            console.log(
                `❌ Failed ${user.emailId}:`,
                err.response?.data || err.message
            );
        }
    }
}

seedUsers();


const webRTC = async () => {
    //Peer 1 
    const lc = new RTCPeerConnection();

    lc.onicecandidate = e => {
        if (e.candidate) {
            console.log("New ICE Candidate:", e.candidate);
        } else {
            console.log("ICE gathering complete");
        }
    };

    const dc = lc.createDataChannel("channel");

    dc.onopen = () => {
        console.log("Connection opened");

        // Send a message after the connection is established
        dc.send("Hello from Peer 1!");
    };

    dc.onmessage = e => {
        console.log("From Peer 2:", e.data);
    };

    const offer = await lc.createOffer();

    await lc.setLocalDescription(offer);

    console.log("OFFER:");
    console.log(JSON.stringify(lc.localDescription));


    //Peer 2
    const rc = new RTCPeerConnection();

    rc.onicecandidate = e => {
        if (e.candidate) {
            console.log("Peer 2 ICE Candidate:", e.candidate);
        } else {
            console.log("Peer 2 ICE gathering complete");
        }
    };

    rc.ondatachannel = e => {
        console.log("Data channel received");

        const dc = e.channel;

        dc.onopen = () => {
            console.log("Connection opened");
            dc.send("Hello from Peer 2!");
        };

        dc.onmessage = e => {
            console.log("From Peer 1:", e.data);
        };
    };

    await rc.setRemoteDescription(offer);

    console.log("Remote description set");

    const answer = await rc.createAnswer();

    await rc.setLocalDescription(answer);

    console.log("Answer created");

    console.log("ANSWER:");
    console.log(JSON.stringify(rc.localDescription));
}

function addVideoInConsole() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });

    const video = document.createElement("video");

    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;

    video.style.width = "500px";
    video.style.height = "400px";
    video.style.background = "black";

    video.srcObject = stream;

    document.body.appendChild(video);
}