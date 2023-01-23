import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { removeReview } from "../../store/reviews";
import { getSpotReviews } from "../../store/reviews";
import { getSpot } from "../../store/spots";
import "./DeleteReview.css";


const DeleteReview = ({ myReview }) => {
	const dispatch = useDispatch();
	const [showDelete, setShowDelete] = useState(false);
	const { closeModal } = useModal();
	const mySpot = useSelector((state) => state.spots.oneSpot);
	const history = useHistory();
  
  
	const handleSubmit = async (e) => {
	  e.preventDefault();
	  dispatch(removeReview(myReview))
			  .then(()=> dispatch(getSpotReviews(mySpot.id)))
			  .then(()=> dispatch(getSpot(mySpot.id)))
			  .then(() => history.push(`/spots/${mySpot.id}`))
			  .then(closeModal)
	};
  
	return (
	  <div className="full-form-container">
		<div className="form-container">
		  <form className="delete-confirmation" onSubmit={handleSubmit}>
			{!showDelete && (
			  <button
				className="delete-one"
				type="button"
				onClick={() => setShowDelete(!showDelete)}
			  >
				Delete Review
			  </button>
			)}
			{showDelete && (
			  <button
				className="final-delete"
				type="submit"
			  >
				Confirm
			  </button>
			)}
		  </form>
		</div>
	  </div>
	);
  };
  export default DeleteReview;