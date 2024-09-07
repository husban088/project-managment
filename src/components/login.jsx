
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import '../App.css';
import { auth } from './firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };


  return (
    <>
    
    <Container fluid className="d-flex align-items-center justify-content-left min-vh-100">
      <Row className="w-100">
        {/* Left Side - Signup Button/Text */}
        <Col xs={12} md={4} className="d-flex flex-column align-items-center justify-content-center text-center text-md-left login__left login__top">
          <div className='top__details'>
          <h2 className='login__weltext'>Welcome!</h2>
          <p className='login__notext'>If you don't have an account, sign up now!</p>
          <Link to={'/signup'} style={{ textDecoration: "none", color: "#fff" }} className="svgwp">
            <svg height="50" width="130"><rect className="shape svg-line" height="50" width="130"></rect></svg>
            <Link to={'/signup'} style={{ textDecoration: "none", color: "#fff" }} className="text">
              Signup
            </Link>
          </Link>
          </div>
        </Col>

        {/* Right Side - Login Section */}
        <Col xs={12} md={8} className='d-flex flex-column align-items-center justify-content-center login__right'>
        <h3 className='login__right-text login__right-texts'>Power code</h3>
          <h3 className='login__right-head login__right-heads'>Login to Your Account</h3>
          <form onSubmit={handleLogin} className="w-100 px-4 login__containers">
            <Form.Group controlId="formEmail" className="mt-3 inputbox">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <span>Email</span>
              <i></i>
            </Form.Group>

            <Form.Group controlId="formPassword" className="mt-3 inputbox">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <span>Password</span>
              <i></i>
            </Form.Group>
            {/* {error && <p>{error}</p>} */}

            <Button style={{ border: "none" }} type="submit" className="mt-3 custom-btn btn-11">
              Login
            </Button>
          </form>
        </Col>
      </Row>
    </Container>
         

    </>
  );
};

export default SignIn;