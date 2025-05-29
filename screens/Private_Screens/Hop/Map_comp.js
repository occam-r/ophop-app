import React from "react";
import Map from "../../Map";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

const Map_comp = ({ navigation, directions_coords }) => {
  const { nearby_shops } = useSelector((state) => state?.baseReducer);
  const { organization_icon } = useSelector((state) => state?.authReducer);

  const params = useRoute();
  // console.warn(organization_icon);
  const shop_coordinates = nearby_shops
    ?.filter((el) => {
      if (params?.params?.tag) {
        return el.tags?.includes(params?.params?.tag);
      } else {
        return el;
      }
    })
    .map((el) => {
      return {
        latlng: {
          latitude: parseFloat(el?.location?.lat),
          longitude: parseFloat(el?.location?.lng),
        },
        id: el.id,
      };
    });

  // console.warn({ shop_coordinates: JSON.stringify(shop_coordinates) });

  return (
    <>
      {shop_coordinates?.length > 0 && (
        <Map
          cont_style={{
            height: 500,
          }}
          navigation={navigation}
          markers={shop_coordinates}
          directions_coords={directions_coords || ""}
        />
      )}
    </>
  );
};

export default Map_comp;
