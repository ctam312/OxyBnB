// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
	const dispatch = useDispatch();
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrors([]);
		return dispatch(sessionActions.login({ credential, password }))
			.then(closeModal)
			.catch(async (res) => {
				const data = await res.json();
				if (data && data.errors) setErrors(data.errors);
			});
	};

	return (
		<div className="login-form-container">
      
			<div className="close-modal-login">
				<button onClick={closeModal}>
					<i className="fa-solid fa-xmark" />
				</button>
			</div>

			<h1 className="login-form-title">Log In</h1>
			<form onSubmit={handleSubmit}>
				<ul className="login-form-errors">
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<div className="login-form-inputs">
					<label className="login-form-label">
						Username or Email:
						<input
							className="login-form-input"
							type="text"
							value={credential}
							onChange={(e) => setCredential(e.target.value)}
							required
						/>
					</label>
					<label className="login-form-label">
						Password:
						<input
							className="login-form-input"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</label>
				</div>
				<button className="login-form-submit" type="submit">
					Log In
				</button>
			</form>
		</div>
	);
}

export default LoginFormModal;
