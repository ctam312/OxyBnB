import { csrfFetch } from "./csrf";

// constant action types
const LOAD_ALL_SPOTS = "spots/LOAD_ALL_SPOTS";
const LOAD_SPOT = "spots/LOAD_SPOT";
const ADD_SPOT = "spots/ADD_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const DELETE_SPOT = "spots/DELETE_SPOT";

//action creator

export const loadSpots = (spots) => ({
	type: LOAD_ALL_SPOTS,
	spots,
});

export const loadSpot = (spot) => ({
	type: LOAD_SPOT,
	spot,
});

export const addSpot = (spot) => ({
	type: ADD_SPOT,
	spot,
});

export const updateSpot = (spot) => ({
	type: UPDATE_SPOT,
	spot,
});

export const deleteSpot = (spot) => ({
	type: DELETE_SPOT,
	spot,
});

//THUNK
export const getSpots = () => async (dispatch) => {
	const res = await csrfFetch("/api/spots");
	if (res.ok) {
		const spots = await res.json();
		dispatch(loadSpots(spots));
		return spots;
	}
};

export const getSpot = (spotId) => async (dispatch) => {
	const res = await fetch(`/api/spots/${spotId}`);
	if (res.ok) {
		const spot = await res.json();
		dispatch(loadSpot(spot));
		return spot;
	}
};

export const editSpot = (updateSpotBody, updateSpotbyId) => async (dispatch) => {
	const res = await csrfFetch(`/api/spots/${updateSpotbyId.id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(updateSpotBody),
	});

	if (res.ok) {
		const updatedSpot = await res.json();
		const finalUpdatedSpot = { ...updatedSpot, ...updateSpotbyId };
		dispatch(updateSpot(finalUpdatedSpot));
	}
	return res;
};

export const removeSpot = (spotId) => async (dispatch) => {
	const res = await csrfFetch(`/api/spots/${spotId}`, {
		method: "DELETE",
	});
    console.log(res)
	if (res.ok) {
		dispatch(deleteSpot(spotId));
	}
    
	return res;
};

export const createSpot = (createSpot, url) => async (dispatch) => {
	const res = await csrfFetch("/api/spots", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(createSpot),
	});
	if (res.ok) {
		const spotDetails = await res.json();

		const spotImageRes = await csrfFetch(
			`/api/spots/${spotDetails.id}/images`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ url, preview: true }),
			}
		);
		if (spotImageRes.ok) {
			const spotImage = await spotImageRes.json();
            // console.log("spotImage", spotImage)
			spotDetails.previewImage = spotImage.url;
			dispatch(addSpot(spotDetails));
			return spotDetails;
		}
	}
	return res;
};

//reducer

const initialState = {
	allSpots: {},
	oneSpot: {},
};

export default function spotReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD_ALL_SPOTS: {
			const loadSpotsState = { allSpots: {}, oneSpot: {} };
			action.spots.Spots.forEach((spot) => {
				loadSpotsState.allSpots[spot.id] = spot;
			});
			return loadSpotsState;
		}
		case LOAD_SPOT: {
			const loadSpotState = { ...state, oneSpot: {} };
			loadSpotState.oneSpot = action.spot;
			return loadSpotState;
		}
		case UPDATE_SPOT: {
			const editSpotState = { ...state, singleSpot: {} };
			editSpotState.allSpots[action.spot.id] = action.spot;
			editSpotState.singleSpot = action.spot;
			return editSpotState;
		}
		case DELETE_SPOT: {
			const deleteSpotState = { ...state, singleSpot: {} };
			delete deleteSpotState.allSpots[action.spotId];
			return deleteSpotState;
		}
		case ADD_SPOT: {
			const addSpotState = { ...state, singleSpot: {} };
			addSpotState.allSpots[action.spot.id] = action.spot;
			return addSpotState;
		}
		default:
			return state;
	}
}
