import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotReviews } from "../../store/reviews";
import DeleteReview from "../DeleteReview";
import "./AllReviews.css";

function AllReviews() {
	const dispatch = useDispatch();

	const spotId = useSelector((state) => state.spots.oneSpot.id);
	const user = useSelector((state) => state.session.user.id);

	const getAvg = useSelector((state) => state.spots.oneSpot.avgStarRating);
	const numRev = useSelector((state) => state.spots.oneSpot.numReviews);
	const spotReviews = useSelector((state) => state.reviews.spot);
	const spotReviewsArr = Object.values(spotReviews);

	useEffect(() => {
		dispatch(getSpotReviews(spotId));
	}, [dispatch, spotId]);

	return (
		<div className="review-div">
			<i className="fa fa-star">
				{" "}
				{getAvg} • {numRev} Reviews
			</i>
			<div className="review-container">
				{spotReviewsArr.map(({ id, review, User }) => (
					<div key={id} className="each-review">
						<p className="user-review-div">
							{review} • {User.firstName} {User.lastName}{" "}
						</p>
                        <div>
						{User.id === user ? <DeleteReview myReview={id} /> : null}
                        </div>
					</div>
				))}
			</div>
		</div>
	);
}

export default AllReviews;
