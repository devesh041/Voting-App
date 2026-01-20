import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../pages/store/ui-slice";
import { voteActions } from "../pages/store/vote-slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// FIX 1: Destructure selectedElection from props
const ConfirmVote = ({ selectedElection }) => {
  const [modalCandidate, setModalCandidate] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close confirm vote modal
  const closeCandidateModal = () => {
    dispatch(uiActions.closeVoteCandidateModal());
  };

  // Get data from Redux
  const selectedVoteCandidate = useSelector(
    (state) => state.vote.selectedVoteCandidate
  );
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const currentVoter = useSelector((state) => state?.vote?.currentVoter);

  // Get the candidate details to display in the modal
  const fetchCandidate = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/candidates/${selectedVoteCandidate}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setModalCandidate(response.data);
    } catch (error) {
      console.log("Error fetching candidate:", error);
    }
  };

  // Confirm vote for selected candidate
  const confirmVote = async () => {
    try {
      // FIX 2: Use PATCH to match your backend route
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/candidates/${selectedVoteCandidate}`,
        { 
          // FIX 3: Send both IDs required by your backend controller
          currentVoterId: currentVoter._id, 
          selectedElection: selectedElection 
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const voteResult = response.data;

      // Update the local voter state with the new votedElections array
      dispatch(
        voteActions.changeCurrentVoter({
          ...currentVoter,
          votedElections: voteResult,
        })
      );
      
      closeCandidateModal();
      navigate("/congrats");
    } catch (error) {
      // Logic for 500 errors usually shows up here
      console.log("Voting Error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (selectedVoteCandidate) {
      fetchCandidate();
    }
  }, [selectedVoteCandidate]);

  return (
    <section className="modal">
      <div className="modal__content confirm__vote-content">
        <h5>Please confirm your vote</h5>

        <div className="confirm__vote-image">
          <img src={modalCandidate?.image} alt={modalCandidate?.fullName} />
        </div>

        <h2>
          {modalCandidate?.fullName?.length > 17
            ? modalCandidate.fullName.substring(0, 17) + "..."
            : modalCandidate?.fullName}
        </h2>

        <p>
          {modalCandidate?.motto?.length > 45
            ? modalCandidate.motto.substring(0, 45) + "..."
            : modalCandidate?.motto}
        </p>

        <div className="confirm__vote-cta">
          <button className="btn" onClick={closeCandidateModal}>
            Cancel
          </button>
          <button className="btn primary" onClick={confirmVote}>
            Confirm
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConfirmVote;