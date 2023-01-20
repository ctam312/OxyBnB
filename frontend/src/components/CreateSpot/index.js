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
		<div className="add-spot-div">
			<div className="header">
				<h2>Create a spot</h2>
			</div>

			<div>
				<ul className="errors">
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
			</div>

			<form className="form" onSubmit={handleSubmit}>
				<div className="form-parts">
					<label>
						Name: 
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</label>

					<label>
						Address: 
						<input
							type="text"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>
					</label>

					<label>
						City: 
						<input
							type="text"
							value={city}
							onChange={(e) => setCity(e.target.value)}
						/>
					</label>

					<label>
						State: 
						<input
							type="text"
							value={state}
							onChange={(e) => setState(e.target.value)}
						/>
					</label>

					<label>
						Country: 
						<input
							type="text"
							value={country}
							onChange={(e) => setCountry(e.target.value)}
						/>
					</label>


					<label>
						Description: 
						<input
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</label>

					<label>
						Price: 
						<input
							type="number"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
						/>
					</label>

					<label>
						Image URL: 
						<input
							type="url"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
						/>
					</label>

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
