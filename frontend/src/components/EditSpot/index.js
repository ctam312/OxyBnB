import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { editSpot } from "../../store/spots";
import "./EditSpot.css";

function EditSpot() {
	const dispatch = useDispatch();
	const history = useHistory();
	const { closeModal } = useModal();
	// console.log(spotId);
	const spot = useSelector((state) => state.spots.oneSpot);

	const [name, setName] = useState(spot?.name || "");
	const [address, setAddress] = useState(spot?.address || "");
	const [city, setCity] = useState(spot?.city || "");
	const [state, setState] = useState(spot?.state || "");
	const [country, setCountry] = useState(spot?.country || "");
	const [description, setDescription] = useState(spot?.description || "");
	const [price, setPrice] = useState(spot?.price || "");

	const [errors, setErrors] = useState([]);

	// const validateSpot = [
	//     check("name")
	//         .notEmpty()
	//         .isLength({ min: 1, max: 50 })
	//         .withMessage("Name must be less than 50 characters"),
	//     check("address").notEmpty().withMessage("Street add"),
	//     check("city").notEmpty().withMessage(""),
	//     check("state").notEmpty().withMessage("S"),
	//     check("country").notEmpty().withMessage("Cou"),
	//     check("lat").notEmpty().isDecimal().withMessage("Latitude is not valid"),
	//     check("lng").notEmpty().isDecimal().withMessage("Longitude is not valid"),
	//     check("description").notEmpty().withMessage("Descrip"),
	//     check("price").notEmpty().isFloat().withMessage("Price per"),
	//     handleValidationErrors,
	// ];

	useEffect(() => {
		const errorArr = [];
		if (name.length <= 0 || name.length >= 50)
			errorArr.push("Name must be less than 50 characters");
		if (address.length === 0) errorArr.push("You must enter a valid Address.");
		if (city.length === 0) errorArr.push("You must enter a valid city.");
		if (state.length === 0) errorArr.push("You must enter a valid state.");
		if (country.length === 0) errorArr.push("You must enter a valid country.");
		if (description.length === 0)
			errorArr.push("You must enter a valid description.");
		if (price <= 0) errorArr.push("You must enter a valid price.");

		setErrors(errorArr);
	}, [name, address, city, state, country, description, price]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors([]);

		const editedSpot = {
			address,
			city,
			state,
			country,
			lat: 88.0,
			lng: 188.88,
			name,
			description,
			price,
		};

		const { id, numReviews, avgStarRating, SpotImages } = spot;

		const spotNeed = {
			id,
			numReviews,
			avgStarRating,
			SpotImages
		};
		

		dispatch(editSpot(editedSpot, spotNeed))
			.then(() => history.push(`/spots/${id}`))
			.then(closeModal)
			.catch(async (res) => {
				// console.log(res)
				const data = await res.json();
				if (data && data.errors) setErrors(data.errors);
			});
	};

	return (
		<div className = "form-container">
			<div className="form-header">
				<h1>Edit your listing</h1>
			</div>
			<div className="form-body-container">
				<div className="owner-edit-form">
					<ul>
						{errors.map((item, idx) => (
							<li key={idx}>{item}</li>
						))}
					</ul>
				</div>
				<form className="form-body" onSubmit={handleSubmit}>
					<label className="form-input">
						Name:
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</label>
					<label className="form-input">
						Address:
						<input
							type="text"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>
					</label>
					<label className="form-input">
						City:
						<input
							type="text"
							value={city}
							onChange={(e) => setCity(e.target.value)}
						/>
					</label>
					<label className="form-input">
						State:
						<input
							type="text"
							value={state}
							onChange={(e) => setState(e.target.value)}
						/>
					</label>
					<label className="form-input">
						Country:
						<input
							type="text"
							value={country}
							onChange={(e) => setCountry(e.target.value)}
						/>
					</label>
					<label className="form-input">
						Description:
						<input
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</label>
					<label className="form-input">
						Price:
						<input
							type="number"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
						/>
					</label>
					<button type="submit">Apply Edits</button>
				</form>
			</div>
		</div>
	);
}

export default EditSpot;
