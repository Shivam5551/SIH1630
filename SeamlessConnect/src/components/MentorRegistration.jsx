import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MentorRegistration = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [test, setTest] = useState();

    useEffect(() => {
        async function getData() {
            const cookie = localStorage.getItem('cookie');
            if (!cookie) return navigate(`/login/Mentor`); // Handle missing cookie
            const response = await fetch(`http://localhost:3000/userdata/Mentor`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${cookie}`, // Authorization header with Bearer token
                },
            });
            if (!response.ok) {
                return navigate('/failed');
            }
            const data = await response.json();
            setUserData(data);
            setTest(data.test);
        }
        getData();
    }, [navigate]);

    const logOut = () => {
        localStorage.clear();
        navigate('/login/Mentor');
    };

    return (
        <Fragment>
            <div className="Head">
                <nav>
                    <h1>Hello, {userData?.firstName} {userData?.lastName}</h1>
                    <span onClick={logOut}>Log Out</span>
                </nav>
            </div>
            <div className="registration-container">
                <div id="sub-container-registration">
                    
                    <div id="test">
                        <p>
                            Take a short test to verify your skills. You can only start the test if you haven't completed it yet.
                        </p>
                        <button
                            className={`button ${test === false ? 'active' : 'disabled'}`}
                            onClick={() => navigate('/mentorTest')}
                            disabled={test !== false}
                        >
                            Start Test
                        </button>
                    </div>

                    <div id="Submit-docs">
                        <p>
                            Submit your documents for verification. This option is available once you pass the test.
                        </p>
                        <button
                            className={`button ${(test === true && userData.filesUpload === false) ? 'active' : 'disabled'}`}
                            onClick={() => navigate('/submitdocs')}
                            disabled={!(test === true && userData.filesUpload === false)}
                        >
                            Submit Docs
                        </button>

                        {userData.filesUpload && (
                            <p className="verification-status">
                                {userData.documentVerified
                                    ? "Your documents have been verified."
                                    : "Your documents are under verification."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default MentorRegistration;
