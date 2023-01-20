import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { removeReview } from "../../store/reviews";
import { getSpot } from "../../store/spots";
import "./DeleteReview.css"

const DeleteReview = ({ myReview }) => {
	const mySpot = useSelector((state) => state.spots.oneSpot);
	const dispatch = useDispatch();
	const { closeModal } = useModal();
	const [boolean, setBoolean] = useState(false);
	const [confirmVisible, setConfirmVisible] = useState(false);

	const history = useHistory();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await dispatch(removeReview(myReview))
            .then(()=> dispatch(getSpot(mySpot.id)))
			.then(closeModal)
		history.push(`/spots/${mySpot.id}`);
	};

	return (
		<div className="full-form-container">
			<div className="form-container">
				<form className="delete-confirmation" onSubmit={handleSubmit}>
					<button
						className="delete-one"
						type="button"
						onClick={() => setConfirmVisible(true)}
					>
						Delete Review
					</button>
					{confirmVisible && (
						<div>
							<input
								type="checkbox"
								className="delete-confirm"
								required
								checked={boolean}
								onChange={() => setBoolean(!boolean)}
							/>
							<h3>Click Box to Confirm</h3>
							<button className="final-delete" type="submit" hidden={!boolean}>
								Confirm
							</button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};
export default DeleteReview;
