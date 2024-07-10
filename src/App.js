import React, { useEffect, useState } from 'react';
import { Card, Image } from 'react-bootstrap';
import FacebookLogin from 'react-facebook-login';
import './App.css';

function App() {
  const [login, setLogin] = useState(false);
  const [data, setData] = useState({});
  const [picture, setPicture] = useState('');
  const [pages, setPages] = useState([]);

  const responseFacebook = (response) => {
    if (response && response.accessToken) {
      console.log(response);
      setData(response);
      setPicture(response.picture.data.url);
      setLogin(true);
    } else {
      console.error('Error logging in:', response);
    }
  }

  useEffect(() => {
    if (login && data.accessToken) {
      const apiUrl = `https://graph.facebook.com/v13.0/me/accounts?access_token=${data.accessToken}`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          console.log(data); // Check the response data
          setPages(data.data);
        })
        .catch(error => console.error(error)); // Catch any errors
    }
  }, [login, data]);

  return (
    <div>
      {!login && (
        <FacebookLogin
          appId="YOUR_APP_ID"
          fields="name,email,picture"
          scope="public_profile,email"
          callback={responseFacebook}
          icon="fa-facebook"
          render={(renderProps) => (
            <button onClick={renderProps.onClick}>Login with Facebook</button>
          )}
        />
      )}
      {login && (
        <div>
          <Card>
            <Card.Body>
              <Image src={picture} alt={data.name} />
              <h2>{data.name}</h2>
              <p>Email: {data.email}</p>
            </Card.Body>
          </Card>
          <h2>Pages owned by you:</h2>
          <ul>
            {pages.map((page, index) => (
              <li key={index}>{page.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;