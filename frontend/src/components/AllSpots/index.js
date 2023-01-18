import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import "./AllSpots.css";

function AllSpots() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getSpots());
	}, [dispatch]);

	const allSpots = useSelector((state) => state.spots);
	const allSpotsArr = allSpots ? Object.values(allSpots).filter((spot) => Object.keys(spot).length !== 0) : [];
	// console.log(allSpotsArr);

    return (
        <div className="spots-div-wrapper">
          <div className="container">
            <div className="row">
              {allSpotsArr.map((spot) => (
                <NavLink to={`/spots/${spot.id}`} className="col-md-4" key={spot.id}>
                  <div className="card">
                    <img src={spot.preview} className="card-img-top" alt={spot.name} />
                    <div className="card-body">
                      <h5 className="card-title">{spot.name}</h5>
                      <p className="card-text">{spot.description}</p>
                      <div className="rating">
                        <i className="fa fa-star" />
                        {spot.avgStars}
                      </div>
                      <div className="price-per-night">${spot.price} night</div>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      );      
}

export default AllSpots;
