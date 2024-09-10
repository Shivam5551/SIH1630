import React, { useState } from "react";
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
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

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
            const response = await fetch("http://localhost:3000/subimtdocs", {
                method: "POST",
                headers: {
                    "Cookie": cookies,
                },
                body: formData,
                credentials: "include"
            });
            if(response.ok) {
                navigate('/verification/waitingpage')
            }
            else {
                navigate('/errorpage');
            }
        } catch (error) {
            console.log(error);
            navigate('/errorpage')
        }
        navigate('/formsubmitted')
    };

    return (
        <div className="submit-docs-main">
            <div className="submit-docs-container">
                <form className="docs-main-form" onSubmit={handleSubmit}>
                    <input 
                        required
                        type="file" 
                        name="idCard" 
                        accept=".pdf" 
                        placeholder="Submit your current org/institute ID cardID(in pdf form)" 
                        onChange={handleChange} 
                    />
                    <small className="id-card-note">*ID card must contain your institution name or contact detail</small>
                    <input 
                        type="url" 
                        name="profileUrl" 
                        placeholder="Enter your LinkedIn profile URL or portfolio website" 
                        value={form.profileUrl} 
                        onChange={handleChange} 
                    />
                    <input 
                        required
                        type="file" 
                        name="certification" 
                        placeholder="Upload your certificates(in pdf form)"
                        accept=".pdf" 
                        value={form.certification} 
                        onChange={handleChange} 
                    />
                    <input 
                        required
                        type="text" 
                        name="education" 
                        placeholder="Enter your educational qualifications" 
                        value={form.education} 
                        onChange={handleChange} 
                    />
                    <input 
                        type="text" 
                        name="experience" 
                        placeholder="Enter your experience (if any)" 
                        value={form.experience} 
                        onChange={handleChange} 
                    />
                    <textarea 
                        name="additionalCertificates" 
                        placeholder="Add more certificates if you have any" 
                        value={form.additionalCertificates} 
                        onChange={handleChange}
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default SubmitDocs;
