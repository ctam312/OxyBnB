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
        spots
})

export const loadSpot = (spot) => ({
    type: LOAD_SPOT,
    spot
})

export const addSpot = (spot) => ({
    type: ADD_SPOT,
    spot
})

export const updateSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot
})

export const deleteSpot = (spot) => ({
    type: DELETE_SPOT,
    spot
})

//THUNK
export const getSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    if (res.ok) {
        const spots = await res.json();
        dispatch(loadSpots(spots))
        return spots;
    }
}

export const getSpot = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`);
    if (res.ok) {
        const spot = await res.json();
        dispatch(loadSpot(spot))
        return spot;
    }
}
//reducer

const initialState = {
    allSpots: {},
    oneSpot: {},
}

export default function spotReducer(state = initialState, action){
    switch (action.type) {
        case LOAD_ALL_SPOTS: {
            const loadSpotsState = {allSpots: {}, oneSpot:{}};
            action.spots.Spots.forEach(spot => {
                loadSpotsState.allSpots[spot.id] = spot;
            })
            return loadSpotsState;
        }
        case LOAD_SPOT: {
            const loadSpotState = { ...state, oneSpot: {}};
            loadSpotState.oneSpot = action.spot;
            return loadSpotState
        }
        default:
            return state;
    }
}