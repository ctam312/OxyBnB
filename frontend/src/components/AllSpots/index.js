import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getSpots } from "../../store/spots";
import "./AllSpots.css";

function AllSpots() {
	const dispatch = useDispatch();
    const history = useHistory();

	useEffect(() => {
		dispatch(getSpots());
	}, [dispatch]);

	const allSpots = useSelector((state) => state.spots.allSpots);
	const allSpotsArr = Object.values(allSpots)
	// console.log(allSpotsArr);

	return (
		<div className="spots-div-wrapper">
			<div className="container">
				<div className="row">
					{allSpotsArr.map((spot) => (
						<div
							to={`/spots/${spot.id}`}
							className="spot-details"
							key={spot.id}
                            onClick={() => history.push(`/spots/${spot.id}`)}
						>
							<div className="card">
								<img
									src={spot.preview}
									className="card-img-top"
									alt={spot.name}
								/>
								<div className="card-body">
									<div className="card-body-ST">
										<h4 className="card-title">{spot.name}</h4>
										<div className="rating">
											<i className="fa fa-star" />
											{spot.avgStars}
										</div>
									</div>
									<p className="distance">{52 - spot.id} miles away</p>
									{/* placeholder for distance away */}
									<div className="price-per-night">${spot.price} night</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default AllSpots;
