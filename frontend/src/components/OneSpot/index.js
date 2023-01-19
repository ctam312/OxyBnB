import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpot } from "../../store/spots";
import { useParams, useHistory } from "react-router-dom";
import "./OneSpot.css";
import OpenModalButton from "../OpenModalButton";

// import EditSpot from '../EditSpotForm/EditSpotForm';
// import DeleteSpot from '../DeleteSpotForm/delete-spot-form';

function OneSpot() {
	const user = useSelector((state) => state.session.user);
	const mySpot = useSelector((state) => state.spots.oneSpot);
	console.log(mySpot.ownerId);
	const owner = useSelector((state) => state.spots.oneSpot.User?.firstName);
	// console.log(owner)
	const spotImgs = mySpot.SpotImages;
	const mySpotImg = spotImgs?.find((img) => img.preview === true);

	const spotReviews = useSelector((state) => state.Reviews);

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
						<i class="fa fa-star">{mySpot.avgStarRating} - {mySpot.numReviews} Reviews - Superhost - {mySpot.address}</i>
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
								<i class="fa fa-calendar-check"> Self check-in</i>
								<div className="check-in-desc">
									Check yourself in with the lockbox.
								</div>
								<i class="fa fa-wifi" aria-hidden="true">
									Wifi Avaliable
								</i>
								<div className="amenities-desc">
									Speedy Wifi is supplied when needed!
								</div>
								<i class="fa fa-user-times" aria-hidden="true">
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
							<i class="fa fa-star">{mySpot.avgStarRating}</i>
							<div className="number-of-reviews">
								<div>{`${mySpot.numReviews} Reviews`}</div>
							</div>
						</div>
						<div className="edit-delete-modal">
							{user && user?.id === mySpot?.ownerId ? (
								<div>
									<btn className="button">
										{
											<OpenModalButton
												// modalComponent={<EditSpot />}
												buttonText="Edit Spot"
											/>
										}
									</btn>
									<btn className="button">
										{
											<OpenModalButton
												// modalComponent={<DeleteSpot />}
												buttonText="Delete Spot"
											/>
										}
									</btn>
								</div>
							) : (
								<div className="fees-div">
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
