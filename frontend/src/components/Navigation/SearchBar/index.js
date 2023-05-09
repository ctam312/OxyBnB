import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { loadAllSearchThunk } from "../../../store/SearchReducer";
import { useDispatch } from "react-redux";
import "./searchbar.css";

const SearchBar = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const [searchInput, setSearchInput] = useState("");
	const allSpots = useSelector((state) => state.spots.allSpots);
	const allSpotsArray = Object.values(allSpots);

	const searchedSpots = allSpotsArray.filter((spot) => {
		if (searchInput == "") {
			return;
		} else {
			if (spot.name.toLowerCase().includes(searchInput.toLowerCase())) {
				return spot.name;
			}
		}
	});

	const slicedSearchedSpots = searchedSpots.slice(0, 10);

	const handleSearch = async (e) => {
		e.preventDefault();

		return await dispatch(loadAllSearchThunk(searchInput))
			.then(() =>
				localStorage.setItem("searchData", JSON.stringify(searchedSpots))
			)
			.then(() => history.push(`/search/${searchInput}`))
			.then(() => setSearchInput(""));
	};

	return (
		<div>
			<div>
				<form onSubmit={handleSearch}>
					<div className="search-bar-container">
						<input
							className="search-bar"
							type="text"
							placeholder="Search for anything"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
						<button className="search-icon" type="submit">
							<i className="fa fa-search"></i>
						</button>
					</div>
				</form>
			</div>
			<div>
				<div className="search-bar-list-items">
					{slicedSearchedSpots.map((spot) => (
						<div
							className="search-list-item"
							onClick={() => {
								history.push(`/spots/${spot.id}`);
								setSearchInput("");
							}}
						>
							{spot.name}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SearchBar;
