import { View, Text } from "react-native";
import React, { useState } from "react";
import Modal_Comp from "../../../../utilities/Modal_Comp";
import Form_Item from "../../../../utilities/Form_Item";
import Flex_Box from "../../../../utilities/Flex_Box";
import Button_Comp from "../../../../utilities/Button_Comp";
import return_error from "../../../../utilities/Return_Error";
import { checkout_api } from "../../../../apis";
import { useDispatch, useSelector } from "react-redux";
import Alert_comp from "../../../../utilities/Alert_comp";
import { set_loading_action } from "../../../../redux_prog/actions/base_action";
import { fetchPaymentIntentClientSecret } from "../../../../utilities/Stripe_Comp/Payment_Page";

const Checkout_Modal = ({
  navigation,
  modalVisible,
  setModalVisible,
  shopping_cart,
  amount,
}) => {
  const [payment_data, setpayment_data] = useState({});
  const { token } = useSelector((state) => state?.authReducer);
  const is_loading = useSelector((state) => state?.baseReducer?.is_loading);
  const dispatch = useDispatch();

  const {
    firstName,
    lastName,
    phone,
    address,
    cardName,
    cardNumber,
    cardMonth,
    cardYear,
    cardCode,
  } = payment_data;

  const upd_payment_data = (obj) => {
    setpayment_data({
      ...payment_data,
      ...obj,
    });
  };

  const pay = () => {
    fetchPaymentIntentClientSecret(amount)
    // const delivery = shopping_cart?.map((el) => {
    //   return {
    //     id: el.id,
    //     value: el.sum_of != "totalCollect",
    //   };
    // });
    // dispatch(set_loading_action(true));
    // checkout_api({ ...payment_data, delivery, amount }, token)
    //   .then((res) => {
    //     console.warn(res.data);
    //     dispatch(set_loading_action(false));
    //   })
    //   .catch((err) => {
    //     dispatch(set_loading_action(false));
    //     console.error(err);
    //     Alert_comp("Invalid Data", return_error(err));
    //   });
  };

  return (
    <Modal_Comp
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      label={"Payment"}
    >
      <Flex_Box
        style={{
          paddingHorizontal: 15,
          gap: 15,
          paddingTop: 5,
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
        <Form_Item
          label={"Name on card"}
          value={cardName}
          onchange={(e) => {
            upd_payment_data({
              cardName: e,
            });
          }}
        />
        <Form_Item
          label={"Card Number"}
          value={cardNumber}
          keyboardType={"numeric"}
          onchange={(e) => {
            upd_payment_data({
              cardNumber: e,
            });
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
            label={"Expiry Month"}
            keyboardType={"numeric"}
            value={cardMonth}
            onchange={(e) => {
              upd_payment_data({
                cardMonth: e,
              });
            }}
          />
          <Form_Item
            style={{
              width: "48%",
            }}
            label={"Expiry Year"}
            keyboardType={"numeric"}
            value={cardYear}
            onchange={(e) => {
              upd_payment_data({
                cardYear: e,
              });
            }}
          />
        </Flex_Box>
        <Form_Item
          label={"Address"}
          value={address}
          onchange={(e) => {
            upd_payment_data({
              address: e,
            });
          }}
        />
        <Form_Item
          label={"Card Code (CVC)"}
          value={cardCode}
          keyboardType={"numeric"}
          onchange={(e) => {
            upd_payment_data({
              cardCode: e,
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
    </Modal_Comp>
  );
};

export default Checkout_Modal;
