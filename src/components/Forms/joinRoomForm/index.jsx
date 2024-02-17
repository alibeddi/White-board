const JoinRoomForm = () => {
    return (

        <form className="form col-md-12 mt-5">
            <div className="form-group">
                <input
                    type="text"
                    className="form-control my-2"
                    placeholder="Enter your name"
                />
            </div>
            <div className="form-group ">
                <input
                    type="text"
                    className="form-control my-2 border"

                    placeholder="Enter room code"
                />
            </div>
            <button className="btn btn-primary mt-4 btn-block form-control">Join Room</button>
        </form>
    );
}
export default JoinRoomForm;