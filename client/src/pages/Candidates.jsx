import React from "react";
import { candidates as dummyCandidates } from "./data";
import { useParams } from "react-router-dom";
import Candidate from "../components/Candidate";
import ConfirmVote from "../components/ConfirmVote";
import { useSelector } from "react-redux";

const Candidates = () => {
  const { id } = useParams();
  const voteCandidateModalShowing = useSelector(state => state.ui.voteCandidateModalShowing)
  // get candidates that belong to this election
  const candidates = dummyCandidates.filter(
    (candidate) => candidate.election === id
  );

  return (
    <>
    <section className="candidates">
      <header className="candidates__header">
        <h1>Vote your candidate</h1>
        <p>
          These are the candidates for the selected election. Please vote once
          and wisely, because you won't be allowed to be in this election again.
        </p>
      </header>
      <div className="container candidates__container">
        {candidates.map((candidate) => (
          <Candidate
            key={candidate.id}
            {...candidate}
          />
        ))}
      </div>
    </section>
    {voteCandidateModalShowing && <ConfirmVote/>}
    </>
  );
};

export default Candidates;
