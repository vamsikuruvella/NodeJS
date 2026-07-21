const UserCard = ({ user }) => {
    const { firstName, lastName, about, photoUrl, age, gender, preview } = user || {};
    gender?gender.toUpperCase():"";
    return (
       user && <div className="flex justify-center">
            
            <div className="card bg-base-300 w-[40rem]  shadow-sm">
                {preview && <div> <h1 className="card-title">Preview</h1></div>}
                <figure>
                    <img
                        src={photoUrl}
                        alt="Shoes" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">{firstName+" "+lastName}</h2>
                    <div>{age && <p> {age }</p>}
                    {gender && <p> {gender }</p>}
                    {about && <p>{about}</p>}</div>
                    <div className="card-actions justify-center">
                        <button className="btn btn-primary">Ignore</button>
                        <button className="btn btn-secondary">Interested</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserCard;