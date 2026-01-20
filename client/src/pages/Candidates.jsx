import React, { use, useEffect , useState } from "react";
import { useParams } from "react-router-dom";
import Candidate from "../components/Candidate";
import ConfirmVote from "../components/ConfirmVote";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const Candidates = () => {
    const token = useSelector((state) => state?.vote?.currentVoter?.token);
    const navigate = useNavigate();

    // Access Control
    useEffect(() => {
      if(!token){
        navigate('/');
      }
    },[])

  const { id: selectedElection } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [canVote, setCanVote] = useState(true);

  const voteCandidateModalShowing = useSelector(
    (state) => state.ui.voteCandidateModalShowing
  );

  const voterId = useSelector(
    (state) => state?.vote?.currentVoter?.id
  );

 const getCandidates = async() => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${selectedElection}/candidates`, {
       withCredentials: true,
       headers: { Authorization: `Bearer ${token}` }
      })
        setCandidates(response.data);
    } catch (error) {
      console.log(error);
    }
  }

 
  // Check if voter has already voted in this election
  const getVoter = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/voters/${voterId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      const votedElections = await response.data.votedElections;
      if(votedElections.includes(selectedElection)){
        setCanVote(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

   useEffect(() => {
    getCandidates();
    getVoter();
  }, []);


  return (
    <>
      <section className="candidates">
        {/* Render "Already Voted" header if applicable */}
        {!canVote && (
          <header className="candidates__header">
            <h1>Already Voted</h1>
            <p>
              You are only permitted to vote once in an election. Please vote in
              another election.
            </p>
          </header>
        )}

        {/* Render Election specific header */}
        {canVote &&
          (candidates.length > 0 ? (
            <header className="candidates__header">
              <h1>Vote your candidate</h1>
              <p>
                These are the candidates for the selected election. Please vote
                once and wisely, because you won’t be allowed to vote in this
                election again.
              </p>
            </header>
          ) : (
            <header className="candidates__header">
              <h1>Inactive Election</h1>
              <p>
                There are no candidates found for this election. Please check
                back later.
              </p>
            </header>
          ))}

        {/* FIX ADDED HERE: Only render the candidates list if the user is allowed to vote */}
        {canVote && (
          <div className="container candidates__container">
            {candidates.map((candidate) => (
              <Candidate key={candidate._id || candidate.id} {...candidate} />
            ))}
          </div>
        )}
      </section>

      {voteCandidateModalShowing && <ConfirmVote selectedElection={selectedElection} />}
    </>
  );
};

export default Candidates;