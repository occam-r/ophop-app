import { View, Text } from "react-native";
import React, { useState } from "react";
import Modal_Comp from "../../../../utilities/Modal_Comp";
import Form_Item from "../../../../utilities/Form_Item";
import Flex_Box from "../../../../utilities/Flex_Box";
import Button_Comp from "../../../../utilities/Button_Comp";
import return_error from "../../../../utilities/Return_Error";
import { checkout_api, fetchPaymentIntentClientSecret } from "../../../../apis";
import { useDispatch, useSelector } from "react-redux";
import Alert_comp from "../../../../utilities/Alert_comp";
import { set_loading_action } from "../../../../redux_prog/actions/base_action";
import Card_Input from "../../../../utilities/Stripe_Comp/Card_Input";
import { useRoute } from "@react-navigation/native";
import { Sidebar_Toggle_Bar } from "../../../Sidebar/Sidebar_Toggle";
import { useConfirmPayment } from "@stripe/stripe-react-native";

const Checkout_Page = ({ navigation }) => {
  const state = useRoute();
  const { shopping_cart, amount } = state.params || {};

  const [payment_data, setpayment_data] = useState({});
  const { token } = useSelector((state) => state?.authReducer);
  const is_loading = useSelector((state) => state?.baseReducer?.is_loading);
  const dispatch = useDispatch();
  const { confirmPayment, loading } = useConfirmPayment();

  const {
    firstName,
    lastName,
    phone,
    address,
  } = payment_data;

  const upd_payment_data = (obj) => {
    setpayment_data({
      ...payment_data,
      ...obj,
    });
  };

  const pay = async () => {
    dispatch(set_loading_action(true));
    const res = await fetchPaymentIntentClientSecret(amount, token);
    const pay_res = await confirmPayment(
      res.data.data.paymentIntent.client_secret,
      {
        type: "Card",
        paymentMethodType: 'Card',
        billingDetails: {
          name: "John Doe", // Customer's name
          email: "john.doe@example.com", // Customer's email
          phone: "+1234567890", // Customer's phone number
          address: {
            city: "San Francisco", // Customer's city
            country: "US", // Customer's country
            line1: "123 Market St", // Customer's street address
            line2: "Suite 900", // Customer's apartment, suite, etc.
            postalCode: "94105", // Customer's postal code
            state: "CA", // Customer's state
          },
        },
      }
    );

    console.warn(JSON.stringify(pay_res?.paymentIntent?.id));

    const delivery = shopping_cart?.map((el) => {
      return {
        id: el.id,
        value: el.sum_of != "totalCollect",
      };
    });
    checkout_api({ ...payment_data, intent_id: pay_res?.paymentIntent?.id, delivery, amount }, token)
      .then((res) => {
        console.warn('<====Checkout data====>');
        console.warn(res.data);
        console.warn('<====Checkout data====>');
        navigation.goBack();
        dispatch(set_loading_action(false));
      })
      .catch((err) => {
        dispatch(set_loading_action(false));
        console.error(err);
        Alert_comp("Invalid Data", return_error(err));
      });
  };

  // const handlePayPress = async (billingDetails) => {
  //   // Replace with your backend URL
  //   const { clientSecret, error } = await fetchPaymentIntentClientSecret();

  //   if (error) {
  //     console.log("Unable to process payment");
  //   } else {
  //     const { paymentIntent, error } = await confirmPayment(clientSecret, {
  //       type: "Card",
  //       billingDetails: {
  //         /* Your billing details */
  //       },
  //     });

  //     if (error) {
  //       console.log(`Payment confirmation error ${error.message}`);
  //     } else if (paymentIntent) {
  //       console.log("Payment successful", paymentIntent);
  //     }
  //   }
  // };

  return (
    <>
      <Sidebar_Toggle_Bar
        func={() => {
          navigation.goBack();
        }}
        sub_route={true}
        label={"Checkout"}
      />
      <Flex_Box
        style={{
          paddingHorizontal: 15,
          gap: 15,
          paddingTop: 25,
        }}
      >
        <Flex_Box
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Form_Item
            style={{
              width: "48%",
            }}
            label={"First Name"}
            value={firstName}
            onchange={(e) => {
              upd_payment_data({
                firstName: e,
              });
            }}
          />
          <Form_Item
            style={{
              width: "48%",
            }}
            label={"Last Name"}
            value={lastName}
            onchange={(e) => {
              upd_payment_data({
                lastName: e,
              });
            }}
          />
        </Flex_Box>
        {/* <Form_Item
          label={"Name on card"}
          value={cardName}
          onchange={(e) => {
            upd_payment_data({
              cardName: e,
            });
          }}
        /> */}
        <Card_Input
          label={"Card Details"}
          onchange={(e) => {
            console.warn(e);

            // upd_payment_data({
            //   cardNumber: e,
            // });
          }}
        />
        <Form_Item
          label={"Phone"}
          value={phone}
          keyboardType={"numeric"}
          onchange={(e) => {
            upd_payment_data({
              phone: e,
            });
          }}
        />
        <Form_Item
          label={"Address"}
          value={address}
          onchange={(e) => {
            upd_payment_data({
              address: e,
            });
          }}
        />
        <Button_Comp
          btn_style={{
            borderRadius: 5,
            paddingVertical: 12,
          }}
          label={"Pay"}
          onClick={pay}
          loading={is_loading}
        />
      </Flex_Box>
    </>
  );
};

export default Checkout_Page;
