import { useState } from "react";
import axios from "axios";
import { addUser } from "../appStore/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./constants";
const Login = () => {
    const [emailId, setEmailId] = useState('smriti18@gmail.com');
    const [password, setPassword] = useState('Smriti@123');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const local = true;
    // 'withCredentials:true' will show the tokens in browser console and also set the cookies in browser dev tools(application tab)
    const handleLogin = async (e) => {
        
        if(local){
            axios.post(BASE_URL + '/login', {
            emailId: emailId,
            password: password
        },{withCredentials:true}
    )
            .then((response) => {
                console.log(response.data);
                dispatch(addUser(response.data));
                return navigate('/');
            })
            .catch((error) => {
                console.error("Line 30: "+JSON.stringify(error.response));
                setError(error.response.data);
            });  }       
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
                     <p className="text-error">{error}</p>
                     <div className="card-actions ml-[165px]">
                    <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                </div>
                    
                    
                </fieldset>
  

               
            </div>
        </div>
    </div>
}

export default Login