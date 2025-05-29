const initialState = {
    loading: false,
    location: null,
    city: null,
    nearby_shops: [],
    tags: [],
    contacts: [],
    city_details: null,
    network: null,
    school_ddl_options: [],
    selected_country: {
        name: 'United States',
        dial_code: '+1',
        flag: '🇺🇸',
        code: 'US'
    }
};

const baseReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'SET_LOCATION':
            return {
                ...state,
                location: action.payload
            };
        case 'SET_CITY':
            return {
                ...state,
                city: action.payload
            };
        case 'SET_NEARBY_SHOPS':
            return {
                ...state,
                nearby_shops: action.payload
            };
        case 'SET_TAGS':
            return {
                ...state,
                tags: action.payload
            };
        case 'SET_CONTACTS':
            return {
                ...state,
                contacts: action.payload
            };
        case 'SET_CITY_DETAILS':
            return {
                ...state,
                city_details: action.payload
            };
        case 'SET_NETWORK':
            return {
                ...state,
                network: action.payload
            };
        case 'SET_SCHOOL_DDL':
            return {
                ...state,
                school_ddl_options: action.payload
            };
        case 'SET_SELECTED_COUNTRY':
            return {
                ...state,
                selected_country: action.payload
            };
        default:
            return state;
    }
};

export default baseReducer; 