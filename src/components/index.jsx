import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { collection, query, orderBy, getDocs, doc, deleteDoc, getDoc, getFirestore, where, onSnapshot } from "firebase/firestore";
import { useNavigate, Link, useLocation } from "react-router-dom";
import 'boxicons/css/boxicons.min.css';
import bgimage from '../components/assets/img.webp';
import { useSpring, animated } from "react-spring";
import { Navbar, Offcanvas, Nav, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getAuth, signOut } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';


function Home() {

    function Number({ n }) {
        const { number } = useSpring({
            from: { number: 0 },
            number: n,
            delay: 200,
            config: { mass: 1, tension: 20, friction: 10 },
        });
        return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>
    }


    const [show, setShow] = useState(false);
    const [shows, setShows] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [users, setUsers] = useState(null);


    const [easyProjects, setEasyProjects] = useState([]);
    const [mediumProjects, setMediumProjects] = useState([]);
    const [hardProjects, setHardProjects] = useState([]);
    const navigate = useNavigate();

    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {

        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setCurrentUserId(user.uid);
        }

        const fetchProjects = (difficulty, setProjects) => {
            const q = query(collection(db, 'projects'), where('difficulty', '==', difficulty));
            onSnapshot(q, (snapshot) => {
                setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
        };

        fetchProjects('easy', setEasyProjects);
        fetchProjects('medium', setMediumProjects);
        fetchProjects('hard', setHardProjects);
    }, []);

    const handleEdit = (id) => {
        navigate(`/edit-project/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'projects', id));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };




    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            console.log(user);

            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUsers(docSnap.data());
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
                                !users ?
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
                            !users ?
                                <Link style={{ textDecoration: "none" }} onClick={handleLogout} className="navside__links">Login</Link>

                                :
                                <Link to={'/'} style={{ textDecoration: "none" }} onClick={handleLogout} className="navside__links">Logout</Link>
                        }


                        <Link onClick={handleClose} to={'/profile'} style={{ textDecoration: "none" }} className="navside__links">Profile</Link>
                        <Link onClick={handleClose} to={'/addproject'} style={{ textDecoration: "none" }} className="navside__links">Create</Link>

                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>




            <Container fluid className="my-5 project__containers">
                <Row className="align-items-center project__sections">
                    <Col md={6} xs={12}>
                        <div className="p-4">
                            <h2 className="project__containers-text">Project managment</h2>
                            <p className="project__containers-para">
                                All my projects are in this website please check out all my projects and enjoy it and tell me what improvement I should make on this website
                                And which of my projects did you like
                            </p>
                            <div className="total__head">
                                <div className="total__head-text">
                                    <h2 className="proj__numb-text"><Number n={27} /><box-icon name='plus' style={{ fill: "#fff" }}></box-icon></h2>
                                    <h2 className="total__proj-text">Projects completed</h2>
                                </div>
                                <div className="total__head-text">
                                    <h2 className="proj__numb-text"><Number n={1} /><box-icon name='plus' style={{ fill: "#fff" }}></box-icon></h2>
                                    <h2 className="total__proj-text">Years of experience</h2>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={6} xs={12}>
                        <img
                            src={bgimage}
                            alt="Right Side Image"
                            fluid
                            className="p-4 projects__banner"
                        />
                    </Col>
                    <svg className="wave__img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#ffffff" fill-opacity="1" d="M0,128L40,149.3C80,171,160,213,240,218.7C320,224,400,192,480,154.7C560,117,640,75,720,96C800,117,880,203,960,208C1040,213,1120,139,1200,122.7C1280,107,1360,149,1400,170.7L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
                    </svg>
                </Row>
            </Container>





            <Container style={{ marginTop: '12rem' }}>
                {/* Hard Projects Section */}
                <h2 className="project__heading-text">Hard Projects</h2>
                <Row>
                    {hardProjects.map((project) => (
                        <Col xs={12} md={6} lg={6} xl={4} key={project.id} className="mb-4"> 
                  
                            <Card className="custom-card-size h-100">

                                <div className="proj__details">

                                    <div className="top__card">

                                        <div className="card__user">
                                            <img src={project.userImage} alt="" className="card__user-img" />
                                            <h3 className="card__user-name">{project.userName}</h3>
                                        </div>


                                        <div className="proj__edit">

                                            {project.userId === currentUserId && (
                                                <>

                                                    <div>
                                                        <i class='bx bx-edit project-edit' onClick={() => handleEdit(project.id)}></i>

                                                    </div>

                                                    <div>
                                                        <i class='bx bx-x project-remove' onClick={() => handleDelete(project.id)}></i>
                                                    </div>
                                                </>
                                            )}

                                        </div>

                                    </div>

                                    <div className="tag__cont">
                                        <h2 className="tag__name">{project.hashtags}</h2>
                                    </div>

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




                                <Link to={`/project/${project.id}`} style={{textDecoration:"none"}}>
                                    <div className="card-image-container">
                                        <Card.Img variant="top" src={project.imageURL} alt={project.name} />
                                    </div>
                                    </Link>

                                <Card.Body className='card__body'>
                                    <Card.Text className='cards__category'>{project.name}</Card.Text>
                                    <Card.Text className='card__titless'>{project.details}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Medium Projects Section */}
                <h2 className="project__heading-text">Medium Projects</h2>
                <Row>
                    {mediumProjects.map((project) => (
                        <Col xs={12} md={6} lg={6} xl={4} key={project.id} className="mb-4">
                        
                            <Card className="custom-card-size h-100">


                                <div className="proj__details">

                                    <div className="top__card">

                                        <div className="card__user">
                                            <img src={project.userImage} alt="" className="card__user-img" />
                                            <h3 className="card__user-name">{project.userName}</h3>
                                        </div>


                                        <div className="proj__edit">

                                            {project.userId === currentUserId && (
                                                <>

                                                    <div>
                                                        <i class='bx bx-edit project-edit' onClick={() => handleEdit(project.id)}></i>

                                                    </div>

                                                    <div>
                                                        <i class='bx bx-x project-remove' onClick={() => handleDelete(project.id)}></i>
                                                    </div>
                                                </>
                                            )}

                                        </div>

                                    </div>

                                    <div className="tag__cont">
                                        <h2 className="tag__name">{project.hashtags}</h2>
                                    </div>

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



                                <Link to={`/project/${project.id}`} style={{textDecoration:"none"}}>
                                    <div className="card-image-container">
                                        <Card.Img variant="top" src={project.imageURL} alt={project.name} />
                                    </div>
                                    </Link>
                                <Card.Body className='card__body'>
                                    <Card.Text className='cards__category'>{project.name}</Card.Text>
                                    <Card.Text className='card__titless'>{project.details}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Easy Projects Section */}
                <h2 className="project__heading-text">Easy Projects</h2>
                <Row>
                    {easyProjects.map((project) => (
                        <Col xs={12} md={6} lg={6} xl={4} key={project.id} className="mb-4">
                         


                                <Card className="custom-card-size h-100">


                                    <div className="proj__details">

                                        <div className="top__card">

                                            <div className="card__user">
                                                <img src={project.userImage} alt="" className="card__user-img" />
                                                <h3 className="card__user-name">{project.userName}</h3>
                                            </div>


                                            <div className="proj__edit">

                                                {project.userId === currentUserId && (
                                                    <>

                                                        <div>
                                                            <i class='bx bx-edit project-edit' onClick={() => handleEdit(project.id)}></i>

                                                        </div>

                                                        <div>
                                                            <i class='bx bx-x project-remove' onClick={() => handleDelete(project.id)}></i>
                                                        </div>
                                                    </>
                                                )}

                                            </div>

                                        </div>

                                        <div className="tag__cont">
                                            <h2 className="tag__name">{project.hashtags}</h2>
                                        </div>

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


                                    <Link to={`/project/${project.id}`} style={{textDecoration:"none"}}>
                                    <div className="card-image-container">
                                        <Card.Img variant="top" src={project.imageURL} alt={project.name} />
                                    </div>
                                    </Link>
                                    <Card.Body className='card__body'>
                                        <Card.Text className='cards__category'>{project.name}</Card.Text>
                                        <Card.Text className='card__titless'>{project.details}</Card.Text>
                                    </Card.Body>
                                </Card>

                           
                        </Col>
                    ))}
                </Row>
            </Container>






            {/* <div className="projects-container" style={{marginTop:"13rem"}}>

      <h2>Easy Projects</h2>
      <div className="project-list">
        {easyProjects.map((project) => (
          <div key={project.id} className="project-item">
            <img src={project.imageURL} alt={project.name} className="project-image" />
            <h3>{project.name}</h3>
            <p>{project.details}</p>
            <div className="user-info">
              <img src={project.userImage} alt={project.userName} className="user-image" />
              <p>{project.userName}</p>
            </div>
            <button onClick={() => handleEdit(project.id)}>Edit</button>
            <button onClick={() => handleDelete(project.id)}>Delete</button>
          </div>
        ))}
      </div>

      <h2>Medium Projects</h2>
      <div className="project-list">
        {mediumProjects.map((project) => (
          <div key={project.id} className="project-item">
            <img src={project.imageURL} alt={project.name} className="project-image" />
            <h3>{project.name}</h3>
            <p>{project.details}</p>
            <div className="user-info">
              <img src={project.userImage} alt={project.userName} className="user-image" />
              <p>{project.userName}</p>
            </div>
            <button onClick={() => handleEdit(project.id)}>Edit</button>
            <button onClick={() => handleDelete(project.id)}>Delete</button>
          </div>
        ))}
      </div>


      <h2>Hard Projects</h2>
      <div className="project-list">
        {hardProjects.map((project) => (
          <div key={project.id} className="project-item">
            <img src={project.imageURL} alt={project.name} className="project-image" />
            <h3>{project.name}</h3>
            <p>{project.details}</p>
            <div className="user-info">
              <img src={project.userImage} alt={project.userName} className="user-image" />
              <p>{project.userName}</p>
            </div>
            <button onClick={() => handleEdit(project.id)}>Edit</button>
            <button onClick={() => handleDelete(project.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div> */}


        </>
    );
}

export default Home;