export const return_error = (err) => {
  if (err?.response?.data?.errors) {
    const keys = Object.keys(err?.response?.data?.errors);
    const firstKey = keys?.length > 0 ? keys[0] : null;
    const emailErrorMessage = err?.response?.data?.errors[firstKey][0];
    return emailErrorMessage;
  } else if (err?.response?.data?.message) {
    const keys = Object.keys(err?.response?.data?.message);
    const firstKey = keys?.length > 0 ? keys[0] : null;
    const emailErrorMessage = firstKey
      ? err?.response?.data?.message[firstKey][0]
      : err?.response?.data?.message;
    return emailErrorMessage;
  } else if (err?.message) {
    return err?.message;
  }
};

export default return_error;
