
import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { doc, getFirestore, setDoc } from "firebase/firestore";

import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { auth, db, storage, firestore } from './firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const storageRef = ref(storage, `profiles/${user.uid}`);

      if (image) {
        await uploadBytes(storageRef, image);
        const photoURL = await getDownloadURL(storageRef);
        await updateProfile(user, { displayName: name, photoURL });
      }

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        password,
        photoURL: user.photoURL || null,
      });

      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
   <>


<Container fluid className="d-flex align-items-center justify-content-left min-vh-100 signup__container">
      <Row className="w-100">


        <Col xs={12} md={8}  className='d-flex flex-column align-items-center justify-content-center login__right'>
        <h3 className='login__right-text login__right-texts'>Power code</h3>
          <h3 className='login__right-head login__right-up login__right-heads'>Create Free Account</h3>
          <form onSubmit={handleSignup} className="w-100 px-4">
            <Form.Group controlId="formName" className="mt-3 inputbox">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              <span>Name</span>
              <i></i>
            </Form.Group>

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

            <Form.Group controlId="formImage" className="mt-3 inputbox">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Group>

           <div>
           {imagePreview && <img src={imagePreview} alt="Profile Preview" width="100" height='100' style={{objectFit:"cover", borderRadius:"50%"}} />}
           </div>

            {/* {error && <p>{error}</p>} */}

            <Button style={{ border: "none" }} type="submit" className="mt-3 custom-btn btn-11">
              Signup
            </Button>
          </form>
        </Col>


       
        <Col xs={12} md={4} className="d-flex flex-column align-items-center justify-content-center text-center text-md-left login__left login__lefts login__botoms">
         <div className='bottom__details'>
         <h2 className='login__weltext'>Welcome!</h2>
          <p className='login__notext'>If you already have an account, just sign in. We've missed you!</p>
          <Link to={'/signup'} style={{ textDecoration: "none", color: "#fff" }} className="svgwp">
            <svg height="50" width="130"><rect className="shape svg-line" height="50" width="130"></rect></svg>
            <Link to={'/signin'} style={{ textDecoration: "none", color: "#fff" }} className="text">
              Signin
            </Link>
          </Link>
         </div>
        </Col>

      </Row>
    </Container>



   




   {/* <form onSubmit={handleSignup}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <input type="file" onChange={handleImageChange} />
      {imagePreview && <img src={imagePreview} alt="Image Preview" />}
      <button type="submit">Sign Up</button>
    </form> */}
    
   </>
  );
};

export default Signup;