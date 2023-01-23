import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReview } from "../../store/reviews";
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
				// console.log(data)
				if (data && data.message) setErrors([data.message]);
			});
	};

	return (
		<div className="create-review-container">
			<div className="close-modal">
				<button onClick={closeModal}>
					<i className="fa-solid fa-xmark" />
				</button>
			</div>

			<div className="create-review-header">
				<h1>Create a Review</h1>
			</div>

			<div className="leave-review-div">
				<div className="form-div">
					<form className="review-form" onSubmit={handleSubmit}>
						<div className="review-form-parts">
							<div className="error-container">
								<ul className="errors">
									{errors.map((error) => (
										<li key={error}>{error} </li>
									))}
								</ul>
							</div>
							<label className="create-review-label">
								Star Rating:
								<select
									className="create-review-input"
									value={stars}
									onChange={updateStars}
								>
									<option value="">Select</option>
									<option value="1"> 1 stars </option>
									<option value="2"> 2 stars </option>
									<option value="3"> 3 stars </option>
									<option value="4"> 4 stars </option>
									<option value="5"> 5 stars </option>
								</select>
							</label>
							<label className="create-review-label">
								Description:
								<input
									className="create-review-input"
									type="text"
									required
									value={review}
									onChange={updateReview}
									placeholder="Click here to type"
								/>
							</label>
							<button className="submitBtn" type="submit">
								Submit Review
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateReview;
