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

function OneSpot() {
	const user = useSelector((state) => state.session.user);
	const mySpot = useSelector((state) => state.spots.oneSpot);
	const numRev = useSelector((state) => state.spots.oneSpot.numReviews)
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
					<h1>
						{mySpot.name} - {mySpot.description}
					</h1>
				</div>
				<div className="spot-information-header">
					<h4>
						<i className="fa fa-star">
							{mySpot.avgStarRating} - {mySpot.numReviews} Reviews - Superhost -{" "}
							{mySpot.city}, {mySpot.state}, {mySpot.country}
						</i>
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
							<div>
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
						</div>
						<div className="oxy-cover-div">
							<h1 className="oxy-cover-header">oxycover</h1>
							<div>
								Every booking includes free protection from Host cancellations,
								listing inaccuracies, and other issues like trouble checking in.
							</div>
							<div className="learn-more-link"> Learn more </div>
						</div>
						<h2 className="spot-desc">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu fugiat
							nulla pariatur. Excepteur sint occaecat cupidatat non proident,
							sunt in culpa qui officia deserunt mollit anim id est laborum.
						</h2>
					</div>
					<div className="price-fees-info">
						<div className="price-reviews-info">
							<div className="price-per-night">
								<h1>{`$${mySpot.price} night`}</h1>
							</div>
							<i className="fa fa-star">{mySpot.avgStarRating}</i>
							<div className="reviews-modal">
								<OpenModalButton
									modalComponent={<AllReviews />}
									buttonText={`${numRev} Reviews`}
								/>
							</div>
						</div>
						<div className="edit-delete-modal">
							{user && user?.id === mySpot?.ownerId ? (
								<div>
									<OpenModalButton
										modalComponent={<EditSpot />}
										buttonText="Edit Spot"
									/>
									<OpenModalButton
										modalComponent={<DeleteSpot />}
										buttonText="Delete Spot"
									/>
								</div>
							) : (
								<div className="fees-div">
									<OpenModalButton
										modalComponent={<CreateReview />}
										buttonText="Create Review"
									/>
									<div>{`${mySpot.price} x 5 nights          $${Math.floor(
										mySpot.price * 5
									)}`}</div>
									<div>{`Cleaning fee     $${70}`}</div>
									<div>{`Service fee      $${114}`}</div>
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
