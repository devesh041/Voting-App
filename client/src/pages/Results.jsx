import React, { useState } from "react";
import { elections as dummyElections } from "./data";
import ResultElection from "../components/ResultElection";

const Results = () => {
  const [elections, setElections] = useState(dummyElections);

  return (
    <section className="results">
      <div className="container results__container">
        {elections.map((election) => (
          <ResultElection
            key={election.id}
            {...election}
          />
        ))}
      </div>
    </section>
  );
};

export default Results;
