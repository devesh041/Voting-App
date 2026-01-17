import React, { useEffect, useState } from "react";
import { Link, UNSAFE_WithComponentProps } from "react-router-dom";
import CandidateRating from "./CandidateRating";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "./Loader";

const ResultElection = ({ _id: id, thumbnail, title }) => {
  const [totalVotes, setTotalVotes] = useState(0);
  const token = useSelector((state) => state?.vote?.currentVoter?.token);
  const [electionCandidates, setElectionCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCandidates = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections/${id}/candidates`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      const candidates = response.data;
      setElectionCandidates(candidates);

      // 2. Calculate the sum BEFORE setting state to avoid loop issues
      const total = candidates.reduce((sum, c) => sum + (c.voteCount || 0), 0);
      setTotalVotes(total);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCandidates();
  }, []);
  return (
    <>
      {isLoading && <Loader />}

      <article className="result">
        <header className="result__header">
          <h4>{title}</h4>

          <div className="result__header-image">
            <img src={thumbnail} alt={title} />
          </div>
        </header>

        <ul className="result__list">
          {electionCandidates.map((candidate) => (
            <CandidateRating
              key={candidate.id}
              {...candidate}
              totalVotes={totalVotes}
            />
          ))}
        </ul>

        <Link to={`/elections/${id}/candidates`} className="btn primary full">
          Enter Election
        </Link>
      </article>
    </>
  );
};

export default ResultElection;
