import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { uiActions } from "../pages/store/ui-slice";
import { voteActions } from "../pages/store/vote-slice";
import { useSelector } from "react-redux";
const Election = ({ _id: id, title, description, thumbnail }) => {

  const dispatch = useDispatch()

  //open update election modal
  const openModal = () => {
    dispatch(uiActions.openUpdateElectionModal())
    dispatch(voteActions.changeIdOfElectionToUpdate(id))
  }

  const isAdmin = useSelector((state) => state?.vote?.currentVoter?.isAdmin);
  return (
    <article className="election">
      <div className="election__image">
        <img src={thumbnail} alt={title} />
      </div>

      <div className="election__info">
        <Link to={`/elections/${id}`}>
          <h4>{title}</h4>
        </Link>

        <p>
          {description?.length > 255
            ? description.substring(0, 255) + "..."
            : description}
        </p>

        <div className="election__cta">
          <Link to={`/elections/${id}`} className="btn sm">
            View
          </Link>
          {isAdmin && <button className="btn sm primary" onClick={openModal}>Edit</button>}
        </div>
      </div>
    </article>
  );
};

export default Election;
