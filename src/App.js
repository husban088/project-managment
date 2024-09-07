
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components';
import Signup from './components/signup';
import SignIn from './components/login';
import { useEffect, useState } from 'react';
import { auth } from './components/firebase';
import Profile from './components/profile';
import AddProject from './components/addproject';
import EditProject from './components/editproject';
import ProjectDetail from './components/projectdetails';

function App() {

  const [user, setUser] = useState();


  useEffect(()=> {
    auth.onAuthStateChanged((user)=> {
      setUser(user)
    })
  },[])

  return (
    <>
      
      <Routes>
        <Route path='/' element={user ? <Home /> : <SignIn/> }/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element={<SignIn setUser={setUser}/>}/>
        <Route path='/profile' element={user ? <Profile /> : <SignIn/> }/>
        <Route path='/addproject' element={user ? <AddProject /> : <SignIn/> }/>
        <Route path="/edit-project/:id" element={user ? <EditProject /> : <SignIn/> }/>
        <Route path="/project/:id" element={user ? <ProjectDetail /> : <SignIn/> }/>
      </Routes>

    </>
  );
}

export default App;