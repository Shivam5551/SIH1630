import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Test = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('Select Category');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/categories');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (!category || category === 'Select Category') return;

        const fetchQuestions = async () => {
            try {
                const cookies = localStorage.getItem('cookie');
                const response = await fetch(`http://localhost:3000/getquestions/${category}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': cookies,
                    },
                    credentials: 'include',
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
    }, [category]);

    const handleOptionChange = (questionId, optionKey) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: optionKey
        }));
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formattedAnswers = Object.keys(answers).map(questionId => ({
            questionID: questionId,
            selectedOption: answers[questionId]
        }));

        try {
            const cookies = localStorage.getItem('cookie');
            const response = await fetch(`http://localhost:3000/submitanswers/${category}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies,
                },
                credentials: 'include',
                body: JSON.stringify({ answers: formattedAnswers }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const result = await response.json();
            if (result.score > 7) {
                navigate('/submitdocs');
            } else {
                navigate('/noteligible');
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

    return (
        <div className='main-test'>
            <select onChange={handleCategoryChange} value={category}>
                <option disabled>Select Category</option>
                {categories.map((cat) => (
                    <option key={cat._id} value={cat.categoryName}>{cat.categoryName}</option>
                ))}
            </select>
            <form onSubmit={handleSubmit}>
                {questions.map((question) => (
                    <div key={question._id}>
                        <div className='question-statement'>{question.statement}</div>
                        <fieldset>
                            {Object.entries(question.options).map(([key, value]) => (
                                <label key={key}>
                                    <input
                                        type="radio"
                                        name={question._id}
                                        value={key}
                                        checked={answers[question._id] === key}
                                        onChange={() => handleOptionChange(question._id, key)}
                                        required
                                    />
                                    {`${key}: ${value}`}
                                </label>
                            ))}
                        </fieldset>
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Test;
