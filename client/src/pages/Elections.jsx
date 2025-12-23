import React, { useState } from "react";
import { elections as dummyElections } from "../pages/data";
import Election from "../components/Election";
import AddElectionModal from "../components/AddElectionModal";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "./store/ui-slice";

const Elections = () => {
  const [elections, setElections] = useState(dummyElections);
  const dispatch = useDispatch()

  // open add election modal
  const openModal = () => {
    dispatch(uiActions.openElectionModal())
  }

  const electionModalShowing = useSelector(state => state.ui.electionModalShowing)
  return (
    <>
    <section className="elections">
      <div className="container elections__container">
        <header className="elections__header">
          <h1>Ongoing Elections</h1>
          <button className="btn primary" onClick={openModal}>Create New Election</button>
        </header>

        <menu className="elections__menu">
          {elections.map((election) => (
            <Election
              key={election.id}
              {...election}
            />
          ))}
        </menu>
      </div>
    </section>
    {electionModalShowing && <AddElectionModal/>}
    </>
  );
};

export default Elections;
