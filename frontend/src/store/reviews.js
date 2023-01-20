import { csrfFetch } from "./csrf";

// constant action types
const LOAD_ALL_REVIEWS = "reviews/LOAD_ALL_REVIEWS";
const ADD_REVIEW = "reviews/ADD_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";

//action creator
//onespot
export const loadReviews = (reviews) => ({
	type: LOAD_ALL_REVIEWS,
	reviews,
});

//onespot
export const addReview = (review) => ({
	type: ADD_REVIEW,
	review,
});

//onespot
export const deleteReview = (review) => ({
	type: DELETE_REVIEW,
	review,
});

//THUNK
export const getSpotReviews = (spotId) => async (dispatch) => {
	const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

	if (res.ok) {
		const reviews = await res.json();
        console.log(reviews)
		dispatch(loadReviews(reviews.Reviews));
		return reviews;
	}
};

export const createReview =
	(createReview, spotId, review) => async (dispatch) => {
		const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(createReview),
		});
		if (res.ok) {
			const reviewDetails = await res.json();
			const newReview = { ...reviewDetails, ...review };
			dispatch(addReview(newReview));
			return reviewDetails;
		}
		return res;
	};
// export const removeSpot = (spotId) => async (dispatch) => {
// 	const res = await csrfFetch(`/api/spots/${spotId}`, {
// 		method: "DELETE",
// 	});
//     console.log(res)
// 	if (res.ok) {
// 		dispatch(deleteSpot(spotId));
// 	}

// 	return res;
// };

//reducer

const initialState = {
	spot: {},
	user: {},
};

export default function reviewReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD_ALL_REVIEWS: {
			const loadReviewState = { spot: {}, user: {} };
			action.reviews.forEach(review => {
				loadReviewState.spot[review.id] = review;
			});
			return loadReviewState;
		}
		case ADD_REVIEW: {
			const addReviewState = { spot:{...state.spot}, singleSpot: {} };
			addReviewState.spot[action.review.id] = action.review;
			return addReviewState;
		}
		// case DELETE_SPOT: {
		// 	const deleteSpotState = { ...state, singleSpot: {} };
		// 	delete deleteSpotState.allSpots[action.spotId];
		// 	return deleteSpotState;
		// }
		default:
			return state;
	}
}
