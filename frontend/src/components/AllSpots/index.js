
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import "./AllSpots.css"

function AllSpots() {
    const dispatch = useDispatch();
    const history = useHistory();
    
    
    
    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])
    
    const allSpots = useSelector((state) => state.spots);
    const allSpotsArr = allSpots ? Object.values(Object.values(allSpots)[0]) : [];

    console.log(allSpotsArr)


    return (

        <div className="spots-div-wrapper">
        <div className="container">
          <div className="row">
            {allSpotsArr.map(spot => (
              <div className="col-md-4" key={spot.id}>
                <div className="card">
                  <img
                    src={spot.preview}
                    className="card-img-top"
                    alt={spot.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{spot.name}</h5>
                    <p className="card-text">{spot.description}</p>
                    <div className="rating">{spot.avgStars}</div>
                    <NavLink to={`/spots/${spot.id}`} className="btn btn-primary">
                      See More
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    )
}

export default AllSpots;