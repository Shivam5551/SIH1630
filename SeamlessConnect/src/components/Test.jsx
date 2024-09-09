/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Test = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate(); 
    // Fetch questions when the component mounts
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                
                const cookies = localStorage.getItem('cookie'); 
                const response = await fetch('http://localhost:3000/getquestions', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': cookies, // Include cookies in the headers
                    },
                    credentials: 'include', // Ensure cookies are sent with request
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setQuestions(data.questions); 
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, []);

    const handleOptionChange = (questionId, optionId) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: optionId
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const cookies = localStorage.getItem('cookies');
            const response = await fetch('http://localhost:3000/submitanswers', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies, 
                },
                credentials: 'include', // Ensure cookies are sent with request
                body: JSON.stringify(answers),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const result = await response.json();
            if (result.score > 7) {
                navigate('/nextRoute'); // Use navigate for programmatic navigation
            } else {
                navigate('/retryRoute'); // Use navigate for programmatic navigation
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {questions.map(question => (
                <div key={question.id}>
                    <img src={question.img} alt={`Question ${question.id}`} />
                    <fieldset>
                        <legend>{question.question}</legend>
                        {question.options.map(option => (
                            <label key={option.id}>
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option.id}
                                    checked={answers[question.id] === option.id}
                                    onChange={() => handleOptionChange(question.id, option.id)}
                                    required
                                />
                                {option.text}
                            </label>
                        ))}
                    </fieldset>
                </div>
            ))}
            <button type="submit">Submit</button>
        </form>
    );
};

export default Test;
