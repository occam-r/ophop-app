
export const login_action = () => ({
    type: 'LOGIN',
});


export const logout_action = () => ({
    type: 'LOGOUT',
});

export const set_token_action = (payload) => ({
    type: 'SET_TOKEN',
    payload
});

export const set_user_action = (payload) => ({
    type: 'SET_USER',
    payload
});

export const set_login_type_action = (payload) => ({
    type: 'SET_LOGIN_TYPE',
    payload
});

export const set_routes_action = (payload) => ({
    type: 'SET_ROUTES',
    payload
});

export const set_org_action = (payload) => ({
    type: 'SET_ORG_ICON',
    payload
});

export const set_auth_location_action = (payload) => ({
    type: 'SET_AUTH_LOCATION',
    payload
});