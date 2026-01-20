import React, { useState , useEffect } from "react";
import Election from "../components/Election";
import AddElectionModal from "../components/AddElectionModal";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "./store/ui-slice";
import UpdateElectionModal from "../components/UpdateElectionModal";
import axios from "axios";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom"; 


const Elections = () => {
   const token = useSelector(state => state?.vote?.currentVoter?.token)
   const navigate = useNavigate();

      useEffect(() => {
        if(!token){
          navigate('/login');
        }
      },[])
  const [elections, setElections] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const dispatch = useDispatch()

  // open add election modal
  const openModal = () => {
    dispatch(uiActions.openElectionModal())
  }
   const isAdmin = useSelector(state => state?.vote?.currentVoter?.isAdmin)
  const electionModalShowing = useSelector(state => state.ui.electionModalShowing)
  const updateElectionModalShowing = useSelector(state => state.ui.updateElectionModalShowing)


  const getElection =async() => {
      setIsloading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}`}})
          setElections(response.data)
      } catch (error) {
        console.log(error);
      }
      setIsloading(false);
  }

  useEffect(() => {
    getElection();
  },[]);

  return (
    <>
    <section className="elections">
      <div className="container elections__container">
        <header className="elections__header">
          <h1>Ongoing Elections</h1>
          {isAdmin && <button className="btn primary" onClick={openModal}>Create New Election</button>}
        </header>

        {isloading ?<Loader/> :<menu className="elections__menu">
          {elections.map((election) => (
            <Election
              key={election._id}
              {...election}
            />
          ))}
        </menu>}
      </div>
    </section>
    {electionModalShowing && <AddElectionModal/>}
    {updateElectionModalShowing && <UpdateElectionModal/>}
    </>
  );
};

export default Elections;
