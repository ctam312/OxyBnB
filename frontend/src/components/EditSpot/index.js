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
	const mySpot = useSelector((state) => state.spots.oneSpot);

	const [name, setName] = useState(mySpot?.name || "");
	const [address, setAddress] = useState(mySpot?.address || "");
	const [city, setCity] = useState(mySpot?.city || "");
	const [state, setState] = useState(mySpot?.state || "");
	const [country, setCountry] = useState(mySpot?.country || "");
	const [description, setDescription] = useState(mySpot?.description || "");
	const [price, setPrice] = useState(mySpot?.price || "");

	const [errors, setErrors] = useState([]);

	// const validateSpot = [
	//     check("name")
	//         .notEmpty()
	//         .isLength({ min: 1, max: 50 })
	//         .withMessage("Name must be less than 50 characters"),
	//     check("address").notEmpty().withMessage("Street address is required"),
	//     check("city").notEmpty().withMessage("City is required"),
	//     check("state").notEmpty().withMessage("State is required"),
	//     check("country").notEmpty().withMessage("Country is required"),
	//     check("lat").notEmpty().isDecimal().withMessage("Latitude is not valid"),
	//     check("lng").notEmpty().isDecimal().withMessage("Longitude is not valid"),
	//     check("description").notEmpty().withMessage("Description is required"),
	//     check("price").notEmpty().isFloat().withMessage("Price per day is required"),
	//     handleValidationErrors,
	// ];

	useEffect(() => {
		const errorArr = [];
		if (name.length <= 0 || name.length >= 50)
			errorArr.push("Name must be less than 50 characters");
		if (address.length === 0) errorArr.push("Street address is required");
		if (city.length === 0) errorArr.push("City is required");
		if (state.length === 0) errorArr.push("State is required");
		if (country.length === 0) errorArr.push("Country is required");
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

		const { id } = mySpot;

		const spotIdNeed = {
			id
		};
		

		dispatch(editSpot(editedSpot, spotIdNeed))
			.then(() => history.push(`/spots/${id}`))
			.then(closeModal)
			.catch(async (res) => {
				console.log(res)
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
						{errors.map((item, index) => (
							<li key={index}>{item.name}</li>
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
							required
						/>
					</label>
					<label className="form-input">
						Address:
						<input
							type="text"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							required
						/>
					</label>
					<label className="form-input">
						City:
						<input
							type="text"
							value={city}
							onChange={(e) => setCity(e.target.value)}
							required
						/>
					</label>
					<label className="form-input">
						State:
						<input
							type="text"
							value={state}
							onChange={(e) => setState(e.target.value)}
							required
						/>
					</label>
					<label className="form-input">
						Country:
						<input
							type="text"
							value={country}
							onChange={(e) => setCountry(e.target.value)}
							required
						/>
					</label>
					<label className="form-input">
						Description:
						<input
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
						/>
					</label>
					<label className="form-input">
						Price:
						<input
							type="number"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							required
						/>
					</label>
					<button type="submit">Apply Edits</button>
				</form>
			</div>
		</div>
	);
}

export default EditSpot;
