import React from "react";
import {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Private = () => {
    const {actions} = useContext(Context)
    const [isLoading, setIsLoading] = useState(true)
    const [characterList, setCharacterList] = useState([])
    const navigate = useNavigate();

    useEffect( () => {
        const isUserValid = async () => {
            const response = await actions.getProtected();
            
            if(!response.ok) {
                console.log("CODIGO DE ERROR DIFERENTE A 200");
                navigate('/login');
            }

            const result = await response.json();
            if(!result.valid_user) {
                console.log("valid_user: " + result.valid_user);
                navigate('/login');
            } else {
                console.log("valid_user: " + result.valid_user);
                setIsLoading(false);
            }
        }
        isUserValid();
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await actions.getAllCharacters();
            let data = await response.json();
            setCharacterList(data.characters);
        } catch(error) {
            console.log("Error al hacer fetching")
        }
        console.log("character list: " + JSON.stringify(characterList));
    }

    return (
        <div>
            {!isLoading && (
                <>
                    <h1>CHRACTERS</h1>
                    

                    <div className="d-flex flex-row">
                    {characterList.length > 0 ? characterList.map((char, index) => (
                        <div className="p-2" key={index}>
                            <img src={char.image_url} witdh="200" height="200" />
                            <p>{char.name}</p>
                        </div>
                    )): ""}
                    </div>
                </>
            )}
        </div>
    )

}