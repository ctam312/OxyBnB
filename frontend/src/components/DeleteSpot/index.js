import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { removeSpot } from "../../store/spots";

const DeleteSpot = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();
	const mySpot = useSelector((state) => state.spots.oneSpot);

	const handleSubmit = async (e) => {
		e.preventDefault();
		await dispatch(removeSpot(mySpot.id))
			.then(history.push(`/`))
			.then(closeModal)  //PROBLEM RIGHT HERE
			.catch(async (res) => {
				const data = await res.json();
				if (data && data.errors) setErrors(data.errors);
			});
	};

	return (
		<div>
			<div>
				<ul>
					{errors.map((error) => (
						<li key={error}>{error}</li>
					))}
				</ul>
			</div>
			<div>
				<form onSubmit={handleSubmit}>
					<button type="submit">Confirm Spot Deletion</button>
				</form>
			</div>
		</div>
	);
};

export default DeleteSpot;
