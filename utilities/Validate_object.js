import React from 'react'

const validate_object = (obj) => {
    for (const key in obj) {
        if (!obj[key]) {
            return { status: false, key }; // Prevent form submission if any value is empty
        }
    };
    return { status: true }
}

export default validate_object
