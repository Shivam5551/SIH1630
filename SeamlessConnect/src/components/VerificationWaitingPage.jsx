import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WaitingPage = () => {
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function getData() {
            const cookie = localStorage.getItem('cookie');
            if (!cookie) return navigate(`/login/Mentor`);
            const response = await fetch(`http://localhost:3000/userdata/Mentor`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${cookie}`,
                },
            });
            if (!response.ok) {
                return navigate('/failed');
            }
            const data = await response.json();
            setUserData(data);
        }
        getData();
    }, [navigate]);

    return (
        <div className="waiting-page">
            <div className="waiting-page-content">
                <h1>Thank You for Your Submission!</h1>
                <p>Your document has been successfully submitted and is now under review...</p>
                <input type="text" placeholder="Paste your virtual screening link here" className="link-input" />
                <button className="connect-button">Connect</button>
            </div>
        </div>
    );
};

export default WaitingPage;
