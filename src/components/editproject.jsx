
import React, { useState, useEffect } from "react";
import { auth, db, storage } from "./firebase";
import { deleteDoc, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Navbar, Offcanvas, Nav, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getAuth, signOut } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';

const EditProject = () => {

  const [user, setUser] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({});
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [netlifyLink, setNetlifyLink] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const docRef = doc(db, 'projects', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProject(data);
        setName(data.name);
        setDetails(data.details);
        setHashtags(data.hashtags.join(', '));
        setGithubLink(data.githubLink);
        setNetlifyLink(data.netlifyLink);
        setDifficulty(data.difficulty);
        setImagePreview(data.imageURL);
      }
    };
    fetchProject();
  }, [id]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleUpdate = async () => {
    const docRef = doc(db, 'projects', id);

    if (image) {
      const storageRef = ref(storage, `projects/${name}`);
      await uploadBytes(storageRef, image);
      const imageURL = await getDownloadURL(storageRef);
      await updateDoc(docRef, { name, details, hashtags: hashtags.split(', '), githubLink, netlifyLink, difficulty, imageURL });
    } else {
      await updateDoc(docRef, { name, details, hashtags: hashtags.split(', '), githubLink, netlifyLink, difficulty });
    }

    navigate('/');
  };

  const handleDelete = async () => {
    const docRef = doc(db, 'projects', id);
    await deleteDoc(docRef);
    navigate('/');
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





      <div className='add__form' style={{ marginTop: "12rem" }}>

        <div className='form__head form__heads'>
          <h1 className="form__text ">Edit and update project</h1>
        </div>

        <div className="inputbox">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <span>Project Name</span>
          <i></i>
        </div>

        <div className='form__area'>
          <textarea value={details} className='form__area-text' cols={10} rows={10} onChange={(e) => setDetails(e.target.value)} placeholder="Project Details" required />
        </div>

        <div className="inputbox">
          <input type="text" value={hashtags} onChange={(e) => setHashtags(e.target.value)} required />
          <span>Hashtags</span>
          <i></i>
        </div>

        <div className="inputbox">
          <input type="text" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} />
          <span>GitHub Link</span>
          <i></i>
        </div>

       <div className="inputbox">
       <input type="text" value={netlifyLink} onChange={(e) => setNetlifyLink(e.target.value)}  />
       <span>Netlify Link</span>
       <i></i>
       </div>

        <div className="inputbox">
        <input type="file" onChange={handleImageChange} />
        </div>

        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="dif__select" required>
        <option value="">Select Difficulty</option>
        <option value="easy" className="dif__opt">Easy</option>
        <option value="medium" className="dif__opt">Medium</option>
        <option value="hard" className="dif__opt">Hard</option>
      </select>

        {imagePreview && <img src={imagePreview} alt="Image Preview" className="img-thumbnail mt-2 addproj__img" />} {/* Show image preview */}

        <div className="update__button">
        <Button style={{border:"none"}} onClick={handleUpdate} className='custom-btn btn-11'>Update</Button>
        </div>

      </div>

    </>
  );
};

export default EditProject;
