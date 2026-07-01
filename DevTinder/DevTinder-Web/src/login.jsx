import { useState } from "react";
import axios from "axios";
const Login = () => {
    const [emailId, setEmailId] = useState('smriti18@gmail.com');
    const [password, setPassword] = useState('Smriti@123');

    const handleLogin = async (e) => {
        axios.post('https://urban-space-xylophone-jw9v9gv54rvc5xg-3000.app.github.dev/login', {
            emailId: emailId,
            password: password
        }, { withCredentials: true })
            .then((response) => {
                console.log(response.data);

            })
            .catch((error) => {
                console.error(error);
            });
    }
    return <div className="flex justify-center items-center h-screen ">
        <div className="card bg-base-100 w-96 shadow-sm ">
            <div className="card-body p-[10px]">


                <fieldset className="fieldset py-[20px] pr-[130px] pl-[100px] rounded-box bg-base-300">
                    <h2 className="card-title justify-center">Login</h2>
                    <div>
                        <legend className="fieldset-legend mb-[5px] text-[15px]">Email ID: {emailId}</legend>
                        <input
                            type="text"
                            value={emailId}
                            onChange={(e) => setEmailId(e.target.value)}
                            className="input w-[350px] mb-[20px]"
                            placeholder=" "
                        />
                    </div>

                    <div>
                        <legend className="fieldset-legend mb-[5px] text-[15px]">Password</legend>
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input w-[350px]"
                            placeholder=""
                        />
                    </div>
                    <br></br>
                    <div className="card-actions ml-[165px]">
                        <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                    </div>


                </fieldset>



            </div>
        </div>
    </div>
}

export default Login