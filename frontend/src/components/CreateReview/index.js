import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReview, removeReview } from "../../store/reviews";
import { useHistory } from "react-router-dom";
import "./CreateReview.css";
import { getSpot } from "../../store/spots";

const CreateReview = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { closeModal } = useModal();
    
	const [review, setReview] = useState("");
	const [stars, setStars] = useState("");
	const [errors, setErrors] = useState([]);
    
	const mySpotId = useSelector((state) => state.spots.oneSpot.id);
	const currUser = useSelector((state) => state.session.user);

	const updateReview = (e) => setReview(e.target.value);
	const updateStars = (e) => setStars(e.target.value);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors([]);

		const createdReview = {
			review,
			stars,
		};

		const reviewNeed = {
			User: currUser,
			ReviewImages: [],
		};

		return dispatch(createReview(createdReview, mySpotId, reviewNeed))
        .then(() => dispatch(getSpot(mySpotId)))
			.then(() => history.push(`/spots/${mySpotId}`))
			.then(closeModal)
			.catch(async (res) => {
				const data = await res.json();
				if (data && data.errors) setErrors(Object.values(data.errors));
			});
	};

	return (
		<div className = "entire-container">
			<div className="leave-review-div">
				<div className ="error-container">
					<ul className="errors">
						{errors.map((error) => (
							<li key={error}>{error} </li>
						))}
					</ul>
				</div>
				<div className="header">
					<h1>Create a Review</h1>
				</div>
				<div className="form-div">
					<form className="review-form" onSubmit={handleSubmit}>
						<label className="star-review">
							<h2>Star Rating:</h2>
							<select value={stars} onChange={updateStars}>
								<option value="">Select</option>
								<option value="1"> 1 stars </option>
								<option value="2"> 2 stars </option>
								<option value="3"> 3 stars </option>
								<option value="4"> 4 stars </option>
								<option value="5"> 5 stars </option>
							</select>
						</label>
						<label className="text-review">
                        <h2>Review Description</h2>
							<input
								type="text"
								required
								value={review}
								onChange={updateReview}
								placeholder="Click here to type"
							/>
						</label>
						<button className="submit-btn" type="submit">
							Submit Review
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateReview;
