import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DemoUser.css";

function DemoUser() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("Demo-lition");
  const [password, setPassword] = useState("password");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  return (
    <div className="demo-button">
        <button className= "butt" type="submit" onClick={handleSubmit}>Login as Demo User</button>
    </div>
  );
}

export default DemoUser;