import React from "react";

const WaitingPage = () => {
    return (
        <div className="waiting-page">
            <div className="waiting-page-content">
                <h1>Thank You for Your Submission!</h1>
                <p>
                    Your document has been successfully submitted and is now under review. Please allow up to 10 working days for verification. Stay in touch with your email for updates regarding the status of your submission. 
                </p>
                <p>
                    After successful verification, you will receive an email containing a link to your virtual screening. Please paste the link in the input box below to proceed with the next steps.
                </p>
                <p>
                    <strong>Note:</strong> Stay aware of frauds and ensure that all communications are through official channels. If you have any doubts, contact our support team for assistance.
                </p>
                <input 
                    type="text" 
                    placeholder="Paste your virtual screening link here" 
                    className="link-input"
                />
                <button className="connect-button">Connect</button>
            </div>
        </div>
    );
}

export default WaitingPage;
