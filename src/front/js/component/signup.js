import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
    const {actions} = useContext(Context)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [statusMessage, setStatusMessage] = useState('Waiting for signup...');
    const {email, password} = formData;
    const navigate = useNavigate();

    useEffect( () => {
        if(localStorage.getItem('jwt-token')){
            navigate('/private');
        }
    }, [])

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e)=> {
        e.preventDefault();
        console.log("Handle Submit activated");
        console.log("formData: " + JSON.stringify(formData));
        
        try {
            const data = await actions.userSignUp(formData)
                .then(response => {
                    return response.json();
                });

            const message = data.message;

            if (data.error) throw new Error(message);
            setStatusMessage(message);

            setFormData({
                email: "",
                password: ""
            })

        } catch(error) {
            setStatusMessage("There was a problem while signing up: " + error.message);
        }
        
    }

    const handleCancel = (e) => {
        e.preventDefault();
        console.log("Handle Cancel activated");
    }

    return(
        <form id="signupForm">
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control"name="email" value={email} 
                    onChange={handleChange} placeholder="Input a valid email" required />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" name="password" value={password} 
                    onChange={handleChange} placeholder="Input a valid password" required />
            </div>
            <div className="row text-center">
                <div id="status"><h3>{statusMessage}</h3></div>
            </div>
            <div className="form-group">
                <div className="row mt-5">
                    <div className="col-6">
                        <button id="CancelBtn" className="form-control btn btn-secondary" onClick={handleCancel}>Cancel</button>
                    </div>
                    <div className="col-6">
                        <button id="submitBtn" className="form-control btn btn-success" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </form>
    )
}