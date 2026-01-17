import React, { useEffect, useState } from 'react';
import { Link, UNSAFE_WithComponentProps } from "react-router-dom";
import { candidates } from '../pages/data'
import CandidateRating from "./CandidateRating";
import { useSelector } from 'react-redux';


const ResultElection = ({_id: id, thumbnail, title }) => {
    const [totalVotes, setTotalVotes] = useState(521)
    const token = useSelector(state => state?.vote?.currentVoter?.token)
    const [electionCandidates , setElectionCandidates] = useState([])
    
    const getCandidates = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}/candidates`,
                {withCredentials: true, headers: { Authorization: `Bearer ${token}` } } )
                const candidates = await response.data;
                setElectionCandidates(candidates)  

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCandidates();
    } , [])
    return (
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
            <Link
                to={`/elections/${id}/candidates`}
                className="btn primary full"
            >
                Enter Election
            </Link>


        </article>
    );
};

export default ResultElection;
