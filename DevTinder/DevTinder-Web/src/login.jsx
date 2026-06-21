const Login = () => {
    return <div className="flex justify-center items-center h-screen ">
        <div className="card bg-base-100 w-96 shadow-sm ">
            <div className="card-body p-[10px]">
                

                <fieldset className="fieldset py-[20px] pr-[130px] pl-[100px] rounded-box bg-base-300">
                   <h2 className="card-title justify-center">Login</h2>
                   <div>
                    <legend className="fieldset-legend mb-[5px] text-[15px]">Email ID</legend>
                    <input
                        type="text"
                        className="input w-[350px] mb-[20px]"
                        placeholder=" "
                    />
                    </div>
                      
                      <div>
                    <legend className="fieldset-legend mb-[5px] text-[15px]">Password</legend>
                    <input
                        type="text"
                        className="input w-[350px]"
                        placeholder=""  
                    />
                    </div>
                     <br></br>
                     <div className="card-actions ml-[165px]">
                    <button className="btn btn-primary">Login</button>
                </div>
                    
                    
                </fieldset>
  

               
            </div>
        </div>
    </div>
}

export default Login