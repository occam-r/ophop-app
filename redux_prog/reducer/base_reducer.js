import { getDistanceBetweenTwoPoints } from "../../utilities/Map_utils";

// reducers/userReducer.js
const initialState = {
  selected_country: {
    name: "-",
    dial_code: "+91",
    // dial_code: "+88",
    flag: "",
    code: "",
  },
  intro_completed: false,
  school_ddl_options: [],
  is_loading: 0,
  current_location: {},
  city_data: [],
  nearby_shops: [],
  tags: [],
  contacts: [],
  city_details: {},
  network_on: true,
};

const baseReducer = (state = initialState, action) => {
  const { current_location } = state;
  const { longitude, latitude } = current_location || {};
  const get_dist_val = (val) => {
    const dist_val = getDistanceBetweenTwoPoints(
      {
        lat: parseFloat(val?.location?.lat),
        lng: parseFloat(val?.location?.lng),
      },
      {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      }
    );

    return dist_val;
  };
  switch (action.type) {
    case "SET_COUNTRY":
      return {
        ...state,
        selected_country: action.payload,
      };
    case "INTRO_COMPLETE":
      return {
        ...state,
        intro_completed: true,
      };
    case "SET_SCHOOL_DDL":
      return {
        ...state,
        school_ddl_options: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        is_loading: action.payload,
      };
    case "SET_LOCATION":
      return {
        ...state,
        current_location: action.payload,
      };
    case "SET_CITY":
      return {
        ...state,
        city_data: action.payload,
      };
    case "SET_NEARBY_SHOPS":
      const sorted_arr =
        action?.payload?.length > 0
          ? action?.payload?.sort((a, b) => {
              return get_dist_val(a) - get_dist_val(b); // Sort by computed age in descending order
            })
          : [];

      return {
        ...state,
        nearby_shops: sorted_arr,
      };
    case "SET_TAGS":
      return {
        ...state,
        tags: action.payload,
      };
    case "SET_CONTACTS":
      return {
        ...state,
        contacts: action.payload,
      };
    case "SET_CITY_DETAILS":
      return {
        ...state,
        city_details: {
          ...state.city_details,
          ...action.payload
        },
      };
    case "SET_NETWORK":
      return {
        ...state,
        network_on: action.payload,
      };
    default:
      return state;
  }
};

export default baseReducer;
