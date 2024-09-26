import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SubmitDocs = () => {
    const [form, setForm] = useState({
        idCard: '',
        profileUrl: '',
        certification: '',
        education: '',
        experience: '',
        additionalCertificates: '',
    });
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();

    // Authorization and fetching user data
    useEffect(() => {
        async function getData() {
            const cookie = localStorage.getItem('cookie');
            if (!cookie) return navigate(`/login/Mentor`);  // Redirect to login if no cookie
            const response = await fetch(`http://localhost:3000/userdata/Mentor`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${cookie}`,
                },
            });
            if (!response.ok) {
                return navigate('/failed');  // Redirect if fetch fails
            }
            const data = await response.json();
            setUserData(data);
        }
        getData();
    }, [navigate]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: files ? files[0] : value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('idCard', form.idCard);
        formData.append('certification', form.certification);
        formData.append('profileUrl', form.profileUrl);
        formData.append('education', form.education);
        formData.append('experience', form.experience);
        formData.append('additionalCertificates', form.additionalCertificates);

        try {
            const cookies = localStorage.getItem('cookie');
            const response = await fetch("http://localhost:3000/submitdocs", {
                method: "POST",
                headers: {
                    "Cookie": cookies,
                },
                body: formData,
                credentials: "include"
            });
            if (response.ok) {
                navigate('/verification/waitingpage');  
            } else {
                navigate('/errorpage'); 
            }
        } catch (error) {
            console.log(error);
            navigate('/errorpage');  // Redirect to error page on catch
        }
    };

    return (
        <div className="submit-docs-main">
            <div className="submit-docs-container">
                <h1>Submit Your Documents</h1>
                <form className="docs-main-form" onSubmit={handleSubmit}>
                    <label htmlFor="idCard">
                        Submit your current org/institute ID card (in PDF form):
                        <input 
                            type="file" 
                            id="idCard" 
                            name="idCard" 
                            accept=".pdf" 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <small className="id-card-note">*ID card must contain your institution name or contact detail</small>
                    
                    <label htmlFor="profileUrl">
                        Enter your LinkedIn profile URL or portfolio website:
                        <input 
                            type="url" 
                            id="profileUrl" 
                            name="profileUrl" 
                            placeholder="Enter your LinkedIn profile URL or portfolio website" 
                            value={form.profileUrl} 
                            onChange={handleChange} 
                        />
                    </label>

                    <label htmlFor="certification">
                        Upload your certificates (in PDF form):
                        <input 
                            type="file" 
                            id="certification" 
                            name="certification" 
                            accept=".pdf" 
                            onChange={handleChange} 
                            required 
                        />
                    </label>

                    <label htmlFor="education">
                        Enter your educational qualifications:
                        <input 
                            type="text" 
                            id="education" 
                            name="education" 
                            placeholder="Enter your educational qualifications" 
                            value={form.education} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>

                    <label htmlFor="experience">
                        Enter your experience (if any):
                        <input 
                            type="text" 
                            id="experience" 
                            name="experience" 
                            placeholder="Enter your experience (if any)" 
                            value={form.experience} 
                            onChange={handleChange} 
                        />
                    </label>

                    <label htmlFor="additionalCertificates">
                        Add more certificates if you have any:
                        <textarea 
                            id="additionalCertificates" 
                            name="additionalCertificates" 
                            placeholder="Add more certificates if you have any" 
                            value={form.additionalCertificates} 
                            onChange={handleChange}
                        />
                    </label>

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default SubmitDocs;
