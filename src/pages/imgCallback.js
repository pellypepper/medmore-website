import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ImgurCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        const token = new URLSearchParams(hash.substring(1)).get('access_token'); // Extract access token
        
        if (token) {
            // Send the access token to your backend
            axios.post(`${process.env.REACT_APP_API_URL}/token`, { accessToken: token })
                .then(response => {
                    console.log('Access token sent to backend:', response.data);
                    navigate('/admin'); // Redirect back to admin dashboard
                })
                .catch(error => {
                    console.error('Error sending access token to backend:', error);
                    navigate('/admin'); // Redirect back to admin in case of error
                });
        } else {
            // Handle error or absence of token
            console.error('No access token found');
            navigate('/admin'); // Redirect back to admin in case of error
        }
    }, [navigate]);

    return <div>Loading...</div>;
};

export default ImgurCallback;
