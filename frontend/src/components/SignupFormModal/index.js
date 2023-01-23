import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';
import { restoreUser } from "../../store/session";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const currUser = useSelector((state)=> state.session.user)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
      .then(() => dispatch(restoreUser(currUser)))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          // console.log(data)
          if (data && data.errors) setErrors([data.errors]);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <div className="signup-form-container">

<div className="close-modal">
				<button onClick={closeModal}>
					<i className = "fa-solid fa-xmark" />
				</button>
			</div>

      <h1 className="title-signup">Sign Up</h1>
      <form className ="signup-form" onSubmit={handleSubmit}>
        <ul className="signup-errors">
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label className="signup-form-label">
          Email
          <input
          className="signup-form-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="signup-form-label">
          Username
          <input
          className="signup-form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="signup-form-label">
          First Name
          <input
          className="signup-form-input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label className="signup-form-label">
          Last Name
          <input
          className="signup-form-input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label className="signup-form-label">
          Password
          <input
          className="signup-form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label className="signup-form-label">
          Confirm Password
          <input
          className="signup-form-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button className="signup-form-button" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;