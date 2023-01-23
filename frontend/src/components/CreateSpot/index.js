import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { createSpot } from "../../store/spots";
import "./CreateSpot.css";

function AddSpotModal() {
	const dispatch = useDispatch();
	const history = useHistory();
	const { closeModal } = useModal();
	const [errors, setErrors] = useState([]);

	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [country, setCountry] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [url, setUrl] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrors([]);
		const newSpot = {
			address,
			city,
			state,
			country,
			lat: 88.00,
			lng: 188.00,
			name,
			description,
			price,
		};

		return dispatch(createSpot(newSpot, url))
			.then((res) => history.push(`/spots/${res.id}`))
			.then(closeModal)
			.catch(async (res) => {
				const data = await res.json();
				if (data && data.errors) setErrors(data.errors);
			});
	};

	return (
		<div className="add-spot-container">
			
			<div className="close-modal">
				<button onClick={closeModal}>
					<i className = "fa-solid fa-xmark" />
				</button>
			</div>

			<div className="add-spot-header">
				<h1>Create a spot</h1>
			</div>



			<form className="add-spot-form" onSubmit={handleSubmit}>
				<div className="add-spot-form-parts">
					<label className="add-spot-form-label">
						Name: 
						<input
						className = "add-spot-form-input"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</label>

					<label className="add-spot-form-label" >
						Address: 
						<input
						className = "add-spot-form-input"
							type="text"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>
					</label>

					<label className="add-spot-form-label">
						City: 
						<input
						className = "add-spot-form-input"
							type="text"
							value={city}
							onChange={(e) => setCity(e.target.value)}
						/>
					</label >

					<label className="add-spot-form-label">
						State: 
						<input
						className = "add-spot-form-input"
							type="text"
							value={state}
							onChange={(e) => setState(e.target.value)}
						/>
					</label>

					<label className="add-spot-form-label">
						Country: 
						<input
						className = "add-spot-form-input"
							type="text"
							value={country}
							onChange={(e) => setCountry(e.target.value)}
						/>
					</label>


					<label className="add-spot-form-label">
						Description: 
						<input
						className = "add-spot-form-input"
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</label>

					<label className="add-spot-form-label">
						Price: 
						<input
						className = "add-spot-form-input"
							type="number"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
						/>
					</label>

					<label className="add-spot-form-label">
						Image URL: 
						<input
						className = "add-spot-form-input"
							type="url"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
						/>
					</label>

			<div className="add-spot-errors">
				<ul className="errors">
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
			</div>
                    <div className = "submitBtn">
					<button type="submit">
						Create Spot
					</button>
                    </div>
				</div>
			</form>
		</div>
	);
}

export default AddSpotModal;
