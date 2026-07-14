const UserCard = ({ user }) => {
    const { firstName, lastName, about, photoUrl, age, gender } = user || {};
    return (
       user && <div className="flex justify-center mt-10">
            <div className="card bg-base-300 w-[40rem]  shadow-sm">
                <figure>
                    <img
                        src={photoUrl}
                        alt="Shoes" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">{firstName+" "+lastName}</h2>
                    {age && gender && <p> {age + gender}</p>}
                    <p>{about}</p>
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