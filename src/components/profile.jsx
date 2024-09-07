
import React, { useState, useEffect } from "react";
import { auth, db, storage, firestore } from "./firebase"; // Ensure storage is imported for image upload
import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Offcanvas, Nav, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, signOut, updatePassword, updateProfile } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const [user, setUser] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setName(data.name);
        setEmail(data.email);
        setImagePreview(data.photoURL); // Ensure the image preview is set correctly
      }
    };
    fetchUserData();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleUpdate = async () => {
    try {
      const user = auth.currentUser;
      let photoURL = userData.photoURL; // Initialize photoURL
  
      // Update Profile Image and Name
      if (image) {
        const storageRef = ref(storage, `profiles/${user.uid}`);
        await uploadBytes(storageRef, image);
        photoURL = await getDownloadURL(storageRef); // Get new photoURL
        await updateProfile(user, { displayName: name, photoURL });
        await updateDoc(doc(db, 'users', user.uid), { name, email, photoURL });
      } else {
        await updateProfile(user, { displayName: name });
        await updateDoc(doc(db, 'users', user.uid), { name, email });
      }
  
      // Update Password if Provided
      if (password) {
        // Re-authenticate the user
        const credential = EmailAuthProvider.credential(user.email, currentPassword); // currentPassword should be obtained from the user
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, password);
      }
  
      // Update all user's projects with new name and photoURL
      const q = query(collection(db, 'projects'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (projectDoc) => {
        await updateDoc(doc(db, 'projects', projectDoc.id), {
          userName: name,
          userImage: photoURL // Use updated or existing photoURL
        });
      });
  
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };
  


  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);

      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("User is not logged in");
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);




  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);

    });

    return () => unsubscribe();

  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>

     {/* =================== NAVBAR ======================= */}

     <Navbar expand="lg" className="custom-navbar">
                <Container fluid>

                    <Navbar.Brand className="custom-brand"><Link to={'/'} style={{ textDecoration: "none", color: "#000" }}>Projects</Link></Navbar.Brand>


                    <Nav className="ms-auto d-none d-lg-flex custom-nav">
                        <Nav.Link onClick={handleClose}><Link to={'/'} style={{ textDecoration: "none", color: "#000" }}>Home</Link></Nav.Link>
                        <Nav.Link onClick={handleClose}>

                            {
                                !user ?
                                    <Link style={{ textDecoration: "none", color: "#000" }} onClick={handleLogout}>Login</Link>

                                    :
                                    <Link to={'/'} style={{ textDecoration: "none", color: "#000" }} onClick={handleLogout}>Logout</Link>
                            }

                        </Nav.Link>
                        <Nav.Link onClick={handleClose}><Link to={'/profile'} style={{ textDecoration: "none", color: "#000" }}>Profile</Link></Nav.Link>
                        <Nav.Link onClick={handleClose}><Link to={'/addproject'} style={{ textDecoration: "none", color: "#000" }}>Create</Link></Nav.Link>
                    </Nav>


                    <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={()=> setShow(!show)} className="ms-auto d-lg-none" />
                </Container>
            </Navbar>


            <Offcanvas show={show} onHide={handleClose} placement="start" backdrop={true} className='navside__bar'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title><Link to={'/'} style={{ textDecoration: "none", color: "#000" }} className="custom-brand">Projects</Link></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column navside__nav">
                        <Link onClick={handleClose} to={'/'} style={{ textDecoration: "none" }} className="navside__links">Home</Link>


                        {
                            !user ?
                                <Link style={{ textDecoration: "none" }} onClick={handleLogout} className="navside__links">Login</Link>

                                :
                                <Link to={'/'} style={{ textDecoration: "none" }} onClick={handleLogout} className="navside__links">Logout</Link>
                        }


                        <Link onClick={handleClose} to={'/profile'} style={{ textDecoration: "none" }} className="navside__links">Profile</Link>
                        <Link onClick={handleClose} to={'/addproject'} style={{ textDecoration: "none" }} className="navside__links">Create</Link>

                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>





      {/* <Container className="my-5 profile__container">
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <Card className="profile__box">

              <div className="profile__image">
                <Card.Img
                  variant="top"
                  src={userData.photoURL}
                  alt="Profile Image"
                  className="img-fluid rounded-circle mt-4 profile__img"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', margin: '0 auto' }}
                />
              </div>


              <Card.Body className='profile__body'>
                <Card.Text className='profile__name'><box-icon type='solid' name='user' style={{ fill: "#245DB8" }}></box-icon> <span className="profile__name-text">{userData.name}</span></Card.Text>
                <Card.Text className='profile__name'>
                  <box-icon type='solid' name='envelope' style={{ fill: "#245DB8" }}></box-icon> <span className="profile__name-text">{userData.email}</span>
                </Card.Text>
                <Card.Text className='profile__name'>
                  <box-icon type='solid' name='lock-alt' style={{ fill: "#245DB8" }}></box-icon> <span className="profile__name-text">{userData.password}</span>
                </Card.Text>
              </Card.Body>
              <Card.Footer className='profile__footer' style={{ textAlign: "center" }}>

                <div className="svgwps profile__edit" onClick={handleEditClick}>
                  <svg height="50" width="130"><rect className="shape svg-lines" height="50" width="130"></rect></svg>
                  <h2 className="texts">
                    Edit
                  </h2>
                </div>
                <br />

                <div className="svgwps" onClick={handleLogout}>
                  <svg height="50" width="130"><rect className="shape svg-lines" height="50" width="130"></rect></svg>
                  <h2 className="texts">
                    Logout
                  </h2>
                </div>

              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container> */}






      <div style={{marginTop:"13rem"}}>
      <Card className="my-3 mx-auto profile__box" style={{ maxWidth: '500px' }}>

         <div className="profile__image">
         <img src={userData.photoURL} alt="Profile" className="profile__img" width='80px' height='80px' style={{objectFit:"cover", borderRadius:"50%", marginRight:"auto", marginLeft:"auto"}} />
         </div>

      <Card.Body>
        <Card.Text className="profile__name">Name: {userData.name}</Card.Text>
        <Card.Text className="profile__name">Email: {userData.email}</Card.Text>
        <Card.Text className="profile__name">Password: {userData.password}</Card.Text>
        {/* <Button variant="primary" onClick={() => setEditMode(true)}>
          Edit
        </Button> */}
      </Card.Body>
    </Card>

        {/* {editMode && (
          <div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="file" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Profile Preview" />}
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        )} */}
      </div>

    </>
  );
};

export default Profile;