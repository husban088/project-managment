import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from "react-router-dom";
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from "./firebase";
import { getAuth, signOut } from "firebase/auth";
import { Navbar, Offcanvas, Nav, Container, Row, Col, Card, Button } from 'react-bootstrap';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

function ProjectDetail() {
  const { id } = useParams(); // Extract the project ID from the URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [users, setUsers] = useState(null);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsers(docSnap.data());
        } else {
          console.log("No user data found");
        }
      } else {
        console.log("User is not logged in");
      }
    });
  };

  useEffect(() => {

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUserId(user.uid);
    }

    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject(docSnap.data());
        } else {
          console.log('No such project!');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchProject();
    fetchUserData();
  }, [id]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUsers(user);
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

  const handleDelete = async () => {
    try {
      const docRef = doc(db, 'projects', id);
      await deleteDoc(docRef);
      alert('Project deleted successfully!');
      // Redirect or update UI after deletion
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while fetching data
  }

  if (!project) {
    return <div>No project found!</div>; // Render a message if no project is found
  }

  return (
    <>
      <Navbar expand="lg" className="custom-navbar">
        <Container fluid>
          <Navbar.Brand className="custom-brand">
            <Link to={'/'} style={{ textDecoration: "none", color: "#000" }}>Projects</Link>
          </Navbar.Brand>
          <Nav className="ms-auto d-none d-lg-flex custom-nav">
            <Nav.Link onClick={handleClose}>
              <Link to={'/'} style={{ textDecoration: "none", color: "#000" }}>Home</Link>
            </Nav.Link>
            <Nav.Link onClick={handleClose}>
              {!users ? (
                <Link style={{ textDecoration: "none", color: "#000" }} onClick={handleLogout}>Login</Link>
              ) : (
                <Link to={'/'} style={{ textDecoration: "none", color: "#000" }} onClick={handleLogout}>Logout</Link>
              )}
            </Nav.Link>
            <Nav.Link onClick={handleClose}>
              <Link to={'/profile'} style={{ textDecoration: "none", color: "#000" }}>Profile</Link>
            </Nav.Link>
            <Nav.Link onClick={handleClose}>
              <Link to={'/addproject'} style={{ textDecoration: "none", color: "#000" }}>Create</Link>
            </Nav.Link>
          </Nav>
          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={()=> setShow(!show)} className="ms-auto d-lg-none" />
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose} placement="start" backdrop={true} className='navside__bar'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <Link to={'/'} style={{ textDecoration: "none", color: "#000" }} className="custom-brand">Projects</Link>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column navside__nav">
            <Link onClick={handleClose} to={'/'} style={{ textDecoration: "none" }} className="navside__links">Home</Link>
            {!users ? (
              <Link style={{ textDecoration: "none" }} onClick={handleLogout} className="navside__links">Login</Link>
            ) : (
              <Link to={'/'} style={{ textDecoration: "none" }} onClick={handleLogout} className="navside__links">Logout</Link>
            )}
            <Link onClick={handleClose} to={'/profile'} style={{ textDecoration: "none" }} className="navside__links">Profile</Link>
            <Link onClick={handleClose} to={'/addproject'} style={{ textDecoration: "none" }} className="navside__links">Create</Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>



      <Container className="my-7" style={{ marginTop: "15rem", marginBottom: "5rem" }}>
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <Card className="text-center details__section">
              <Card.Body>
                <div className="user-info d-flex align-items-center justify-content-between mb-3">
                  {/* Left Side: User Image and Name */}
                  <div className="d-flex align-items-center">
                    <img
                      src={project.userImage}
                      alt={project.userName}
                      roundedCircle
                      style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "10px" }}
                    />
                    <h5 className="mb-0" style={{ color: "#fff", fontSize: "1.8rem" }}>{project.userName}</h5>
                  </div>

                  {/* Right Side: Edit and Delete Icons */}
                  <div>

                    {project.userId === currentUserId && (
                      <>

                        <Link to={`/edit-project/${id}`} className="text-decoration-none text-dark">
                          <FaEdit style={{ cursor: "pointer", color: "#fff", marginRight: "15px", fontSize: "2.3rem" }} />
                        </Link>
                        <FaTrashAlt
                          style={{ cursor: "pointer", color: "#fff", fontSize: "2rem" }}
                          onClick={handleDelete}
                        />

                      </>
                    )}
                  </div>
                </div>

               <div className="details__links">
               <div className="tag__conts tag__git">
                  <h2 className="tag__names">
                    {project.netlifyLink && (
                      <a href={project.netlifyLink} className="tag__links" target="_blank" rel="noopener noreferrer">
                        {project.netlifyLink}
                      </a>
                    )}
                  </h2>
                </div>

                <div className="tag__conts">
                  <h2 className="tag__names">
                    {project.githubLink && (
                      <a href={project.githubLink} className="tag__links" target="_blank" rel="noopener noreferrer">
                        {project.githubLink}
                      </a>
                    )}
                  </h2>
                </div>
               </div>

                {/* Project Name and Details */}
                <Card.Text className="mb-2 details__name">{project.name}</Card.Text>
                <Card.Text className="mb-4 details__details">{project.details}</Card.Text>

                {/* Project Image */}
                <Card.Img variant="bottom" src={project.imageURL} alt={project.name} className='details__img' />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>


    </>
  );
}

export default ProjectDetail;
