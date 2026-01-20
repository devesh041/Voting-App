import React , { use, useEffect , useState} from "react";
import { useParams } from "react-router-dom";
import ElectionCandidate from "../components/ElectionCandidate";
import { IoAddOutline } from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux"
import { uiActions } from "../pages/store/ui-slice";
import AddCandidateModal from "../components/AddCandidateModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { voteActions } from "./store/vote-slice";

const ElectionDetails = () => {

  const [isLoading , setIsLoading] = useState(false);
  const [election, setElection] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const { id } = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const isAdmin = useSelector((state) => state?.vote?.currentVoter?.isAdmin);
  const addCandidateModalShowing = useSelector(state=> state.ui.addCandidateModalShowing)

  const getElection = async () => {
     setIsLoading(true);
     try {
       const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
       })
        setElection(response.data);
     } catch (error) {
      console.log(error);
     }
  }

  const getCandidates = async() => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}/candidates`, {
       withCredentials: true,
       headers: { Authorization: `Bearer ${token}` }
      })
        setCandidates(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getVoters = async() => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}/voters`, {
       withCredentials: true,
       headers: { Authorization: `Bearer ${token}` }
      })
        setVoters(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteElection = async () => {
       try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/elections/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        })
        navigate('/elections');
       } catch (error) {
        console.log(error);
       }
  }

  useEffect(() => {
    getElection();
    getCandidates();
    getVoters();
  }, []);

  //open add candidate modal
  const openModal = () => {
    dispatch(uiActions.openAddCandidateModal())
    dispatch(voteActions.changeAddCandidateElectionId(id))
  }
  return (
    <>
    <section className="electionDetails">
      <div className="container electionDetails__container">
        <h2>{election.title}</h2>
        <p>{election.description}</p>

        <div className="electionDetails__image">
          <img
            src={election.thumbnail}
            alt={election.title}
          />
        </div>

        <menu className="electionDetails__candidates">
              {candidates.map((candidate) => 

            <ElectionCandidate

              key={candidate._id}

              {...candidate}

            />

          )}
          {isAdmin && <button className="add__candidate-btn" onClick={openModal}><IoAddOutline /></button>}
        </menu>
        <menu className="voters">
          <h2>Voters</h2>

          <table className="voters__table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
            {
              voters.map((voter) => (
                <tr key={voter._id}>
                  <td>{voter.fullName}</td>
                  <td>{voter.email}</td>
                  <td>{voter.votedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </menu>

        {isAdmin && <button className=' btn danger full ' onClick={deleteElection} >Delete Election</button>}

      </div>
    </section>
    {addCandidateModalShowing && <AddCandidateModal/>}
    </>
  );
};

export default ElectionDetails;
