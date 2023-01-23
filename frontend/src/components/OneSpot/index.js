import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpot } from "../../store/spots";
import { useParams, useHistory } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import EditSpot from "../EditSpot";
import DeleteSpot from "../DeleteSpot";
import AllReviews from "../AllReviews";
import CreateReview from "../CreateReview";
import "./OneSpot.css";
import oxycover from "./oxycov.png";

function OneSpot() {
	const user = useSelector((state) => state.session.user);
	const mySpot = useSelector((state) => state.spots.oneSpot);
	const numRev = useSelector((state) => state.spots.oneSpot.numReviews);
	const owner = useSelector((state) => state.spots.oneSpot.User?.firstName);
	const spotImgs = mySpot.SpotImages;
	const mySpotImg = spotImgs?.find((img) => img.preview === true);
	const spotReviews = useSelector((state) => state.Reviews);
	// console.log(mySpot)
	// console.log(mySpot.ownerId);
	// console.log(owner)
	const dispatch = useDispatch();
	const { spotId } = useParams();
	const history = useHistory();

	useEffect(() => {
		dispatch(getSpot(spotId)).catch(() => history.push("/"));
	}, [dispatch, spotId, spotReviews, history]);

	if (!mySpot?.id) return null;
	return (
		<div>
			<div className="spot-header">
				<div className="spot-name-title">
					<h1>{mySpot.name}</h1>
				</div>
				<div className="spot-information-header">
					<h4>
						<i className="fa fa-star" />
						{mySpot.avgStarRating} - {mySpot.numReviews} Reviews
						{mySpot.city}, {mySpot.state}, {mySpot.country}
					</h4>
				</div>
			</div>

			<div className="main-single-spot-div">
				<div className="spot-preview-image-div">
					<img
						className="preview-image-div"
						src={mySpotImg?.url}
						alt="spot-pic-url"
					></img>
				</div>

				<div className="spot-modal-and-details">
					<div className="spot-information">
						<h1 className="hosted-by">Entire unit hosted by {owner} </h1>

						<div className="details-section">
								<i className="fa fa-calendar-check"> Self check-in</i>
								<div className="check-in-desc">
									Check yourself in with the lockbox.
								</div>
								<i className="fa fa-wifi" aria-hidden="true">
									Wifi Avaliable
								</i>
								<div className="amenities-desc">
									Speedy Wifi is supplied when needed!
								</div>
								<i className="fa fa-user-times" aria-hidden="true">
									Free cancellations before Oct 3rd.
								</i>
								<div className="cancel-desc">
									Feel free to contact support for cancellation!
								</div>
						</div>

						<div className="oxy-cover-div">
							<img className="cover-logo" src={oxycover} alt="oxycover-logo" />
							<div>
								Every booking includes free protection from Host cancellations,
								listing inaccuracies, and other issues like trouble checking in.
							</div>
							<div className="learn-more-link"> Learn more </div>
						</div>

						<div className="spot-description">
							<h2 className="spot-desc">Description:</h2>
							<h3>{mySpot.description}</h3>
						</div>


					</div>

						<div className="price-reviews-info">
							<div className="price-per-night">
								<h1>{`$${mySpot.price} night`}</h1>
							</div>
							<i className="fa fa-star"/>
							{mySpot.avgStarRating} Reviews
							<AllReviews/>
						</div>

					<div className="price-fees-info">
						<div className="edit-delete-modal">
							{user && user?.id === mySpot?.ownerId ? (
								<div>
									<OpenModalButton
										modalComponent={<EditSpot />}
										buttonText="Edit Spot"
									/>
									<OpenModalButton
									className = "delete-spot"
										modalComponent={<DeleteSpot />}
										buttonText="Delete Spot"
									/>
								</div>
							) : (
								<div className="create-review-button">
									<OpenModalButton
										modalComponent={<CreateReview />}
										buttonText="Create Review"
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default OneSpot;
