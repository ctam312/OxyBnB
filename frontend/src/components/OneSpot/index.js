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
		<div className = "full-container">
			<div className="spot-header">
				<div className="spot-name-title">
					<h1>{mySpot.name}</h1>
				</div>
				<div className="spot-information-header">
					<h3>
						<i className="fa fa-star" /> {" "}
						{mySpot.avgStarRating} · {mySpot.numReviews} reviews · {" "}
						{mySpot.city}, {mySpot.state}, {mySpot.country}
					</h3>
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
						<div className="host-edit-delete">
							<h2 className="hosted-by">Entire unit hosted by {owner} </h2>

							<div className="edit-delete-modal">
								{user && user?.id === mySpot?.ownerId ? (
									<div className = "edit-delete-btn">
										<OpenModalButton
										className = "edit-spot"
											modalComponent={<EditSpot />}
											buttonText="Edit Spot"
										/>
										<OpenModalButton
											className="delete-spot"
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

						<div className="price-per-night">
							<h2>{`$${mySpot.price} night`}</h2>
						</div>

						<div className="details-section">
							<p className="main-items">
								<i className="fa fa-calendar-check" /> Self check-in
							</p>
							<div className="desc">Check yourself in with the lockbox.</div>
							<p className="main-items">
								<i className="fa fa-wifi" aria-hidden="true" /> Wifi Avaliable
							</p>
							<div className="desc">Speedy Wifi is supplied when needed!</div>
							<p className="main-items">
								<i className="fa fa-user-times" aria-hidden="true" /> Free
								cancellations before 30 days of booking.
							</p>
							<div className="desc">
								Feel free to contact support for cancellation!
							</div>
						</div>

						<div className="oxy-cover-div">
							<img className="cover-logo" src={oxycover} alt="oxycover-logo" />
							<div className="cover-desc">
								Every booking includes free protection from Host cancellations,
								listing inaccuracies, and other issues like trouble checking in.
							</div>
						</div>

						<div className="spot-description">
							<h3>{mySpot.description}</h3>
						</div>
					</div>

					<div className="review-details">
						<div className="review-title">
							<h3>
								<i className="fa fa-star" /> {mySpot.avgStarRating} ·{" "}
								{mySpot.numReviews} reviews
							</h3>
						</div>

						<AllReviews />
					</div>
				</div>
			</div>
		</div>
	);
}

export default OneSpot;
