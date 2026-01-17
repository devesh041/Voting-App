import React, { useEffect, useState } from "react";
import ResultElection from "../components/ResultElection";
import axios from "axios";
import { useSelector } from "react-redux";

const Results = () => {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get the token from Redux store
  const token = useSelector(state => state?.vote?.currentVoter?.token);

  const getElections = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.data;
      setElections(data);
    } catch (error) {
      console.error("Error fetching elections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // MANDATORY FIX: Only fetch if token exists to avoid 401 errors on mount
    if (token) {
      getElections();
    }
  }, [token]); // MANDATORY FIX: Dependency array ensures it runs when token is ready

  return (
    <section className="results">
      <div className="container results__container">
        {elections.length > 0 ? (
          elections.map((election) => (
            <ResultElection 
              key={election._id} // MANDATORY FIX: MongoDB uses _id, not id
              {...election} 
            />
          ))
        ) : (
          !isLoading && <h2>No elections found.</h2>
        )}
      </div>
    </section>
  );
};

export default Results;