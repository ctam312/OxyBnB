import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import DemoUser from "../DemoUser";
import "./ProfileButton.css";
import AddSpotModal from "../CreateSpot";

function ProfileButton({ user }) {
	const dispatch = useDispatch();
	const [showMenu, setShowMenu] = useState(false);
	const ulRef = useRef();

	const openMenu = () => {
		if (showMenu) return;
		setShowMenu(true);
	};

	useEffect(() => {
		if (!showMenu) return;

		const closeMenu = (e) => {
			if (!ulRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		};

		document.addEventListener("click", closeMenu);

		return () => document.removeEventListener("click", closeMenu);
	}, [showMenu]);

	const closeMenu = () => setShowMenu(false);

	const logout = (e) => {
		e.preventDefault();
		dispatch(sessionActions.logout());
		closeMenu();
	};

	const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

	return (
		<>
			<button className="hamburger" onClick={openMenu}>
        <div className ="burger-icon">
				<i className="fa-solid fa-bars" />
        </div>
        <div className ="user-icon">
				<i className="fas fa-user-circle" />
        </div>
			</button>
			<ul className={ulClassName} ref={ulRef}>
				{user ? (
					<>
						<li>{user.username}</li>
						<li>{user.email}</li>
						<button>
							<OpenModalMenuItem
								itemText="Create a new listing"
								onItemClick={closeMenu}
								modalComponent={<AddSpotModal/>}
							/>
						</button>
						<li>
							<button onClick={logout}>Log Out</button>
						</li>
					</>
				) : (
					<>
						<OpenModalMenuItem
							itemText="Log In"
							onItemClick={closeMenu}
							modalComponent={<LoginFormModal />}
						/>
						<OpenModalMenuItem
							itemText="Sign Up"
							onItemClick={closeMenu}
							modalComponent={<SignupFormModal />}
						/>
						<DemoUser />
					</>
				)}
			</ul>
		</>
	);
}

export default ProfileButton;
