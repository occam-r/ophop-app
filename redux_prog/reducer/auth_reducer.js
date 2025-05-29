import { useSelector } from "react-redux";
import { getDistanceBetweenTwoPoints } from "../../utilities/Map_utils";

// reducers/userReducer.js
const initialState = {
  is_authenticated: false,
  token: "",
  user_data: {},
  login_type: "",
  routes: [],
  organization_icon: "",
  auth_current_location: {},
};

const authReducer = (state = initialState, action) => {
  const { auth_current_location } = state;
  const { longitude, latitude } = auth_current_location || {};
  const get_dist_val = (val) => {
    return getDistanceBetweenTwoPoints(
      {
        lat: parseFloat(val?.location?.lat),
        lng: parseFloat(val?.location?.lng),
      },
      {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      }
    );
  };

  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        is_authenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        is_authenticated: false,
      };
    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
      };
    case "SET_USER":
      return {
        ...state,
        user_data: action.payload,
      };
    case "SET_LOGIN_TYPE":
      return {
        ...state,
        login_type: action.payload,
      };
    case "SET_ROUTES":
      const sorted_arr =
        action?.payload?.length > 0
          ? action?.payload?.sort((a, b) => {
              return get_dist_val(a) - get_dist_val(b); // Sort by computed age in descending order
            })
          : [];

      return {
        ...state,
        routes: sorted_arr,
      };
    case "SET_ORG_ICON":
      return {
        ...state,
        organization_icon: action.payload,
      };
      case "SET_AUTH_LOCATION":
        return {
          ...state,
          auth_current_location: action.payload,
        };
    default:
      return state;
  }
};

export default authReducer;
