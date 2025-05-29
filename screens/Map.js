import { useEffect, useState, memo, useRef } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { map_api_key } from "../utilities/map_api_key";
import { useSelector } from "react-redux";
import Alert_comp from "../utilities/Alert_comp";
import ORGANIZATION_ICONS from "../utilities/OrganizationIcon/OrganizationIcon";
import FastImage from "react-native-fast-image";

const CustomMarker = memo(({ marker, organization_icon, onPress }) => (
  <FastImage
    source={{ uri: ORGANIZATION_ICONS[organization_icon] }}
    style={{
      height: 35,
      width: 35,
      resizeMode: "stretch",
    }}
  />
));

const Map = ({ navigation, modal, cont_style, markers, directions_coords }) => {
  const mapRef = useRef(null);
  const cont_style_obj = cont_style || {};
  const styles = StyleSheet.create({
    container: modal
      ? {
          flex: 1,
          ...StyleSheet.absoluteFillObject,
        }
      : {
          ...StyleSheet.absoluteFillObject,
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          ...cont_style_obj,
        },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  const { current_location, city_details } = useSelector(
    (state) => state?.baseReducer
  );

  const { organization_icon } = useSelector((state) => state?.authReducer);

  useEffect(() => {
    Object.keys(ORGANIZATION_ICONS).forEach((icon) => {
      Image.prefetch(ORGANIZATION_ICONS[icon]);
    });
  }, []);

  const city_lat_lng = city_details?.city_data?.location
    ? {
        latitude: parseFloat(city_details?.city_data?.location?.lat),
        longitude: parseFloat(city_details?.city_data?.location?.lng),
      }
    : {};

  console.warn({
    // city_lat_lng,
    // city_data: city_details?.city_data,
    current_location
  });

useEffect(() => {
  if (current_location?.latitude && mapRef.current) {
    mapRef.current.animateToRegion({
      ...current_location,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  }
}, [current_location,mapRef])


  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: -37.834951,
          longitude: 145.10532,
          latitudeDelta: 0.05, // Adjust as needed
          longitudeDelta: 0.05, // Adjust as needed
          ...city_lat_lng,
        }}
      >
        {!directions_coords &&
          markers?.length > 0 &&
          markers.map((marker, index) => (
            <Marker
              onPress={() => {
                navigation?.navigate("Store Details", {
                  id: marker?.id,
                });
              }}
              coordinate={marker.latlng}
              image={ORGANIZATION_ICONS[organization_icon]}
              style={{
                height: 185,
                width: 185,
              }}
            />
          ))}
          {
            current_location?.latitude &&
            <Marker
              coordinate={current_location}
              image={ORGANIZATION_ICONS.kangaroo}
              style={{
                height: 185,
                width: 185,
              }}
            />
          }
        {directions_coords && (
          <>
            <MapViewDirections
              origin={current_location}
              destination={directions_coords}
              apikey={map_api_key}
              strokeWidth={8}
              strokeColor="blue"
              onError={(err) => {
                console.error(err);
                Alert_comp("Oops!", "Cannot find path between the locations!");
              }}
            />
            <Marker coordinate={directions_coords} />
          </>
        )}
      </MapView>
    </View>
  );
};

export default Map;
