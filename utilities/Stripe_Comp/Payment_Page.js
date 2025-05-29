
export const fetchPaymentIntentClientSecret = async (amt) => {
  try {
    const response = await fetch(
      "http://110.173.132.56/CharityApi/api/v1/user/shoppingCart/generate-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 100, // Amount in cents
        }),
      }
    );
    const { clientSecret, error } = await response.json();
    return { clientSecret, error };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

