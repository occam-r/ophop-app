import { Linking } from "react-native";

export const getDistanceBetweenTwoPoints = (cord1, cord2) => {
  if (cord1.lat === cord2.lat && cord1.lng === cord2.lng) {
    return 0;
  }

  const radlat1 = (Math.PI * cord1.lat) / 180;
  const radlat2 = (Math.PI * cord2.lat) / 180;

  const theta = cord1.lng - cord2.lng;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist *= 1.609344; // convert miles to km
  const result = Number(dist).toFixed(2) * 1000;
  return result || 0;
};

export const formatDistance = (distInMeters) => {
  if (typeof distInMeters !== "number") {
    return "0 M";
  }
  if (distInMeters > 0) {
    if (distInMeters < 1000) {
      return `${distInMeters} M`;
    }
    return `${Number(distInMeters / 1000).toFixed(1)} KM`;
  } else {
    return "GPS is Off";
  }
};

export const formatTime = (timeInSeconds) => {
  if (typeof timeInSeconds !== "number") {
    return "0 s";
  }
  if (timeInSeconds < 60) {
    return "Less than a minute";
  }
  return `${Number(timeInSeconds / 60).toFixed(1)} minutes`;
};

export const removeObjectById = ({ mapInstance, objectId }) => {
  mapInstance.getObjects().forEach((object) => {
    if (object.getId() === objectId) {
      mapInstance.removeObject(object);
    }
  });
};

export const centerMapOnCoords = (mapInstance, lat, lng) => {
  mapInstance.setCenter({ lat, lng });
};

export const openGoogleMapsNavigation = (lat, lng) => {
  const url = `https://www.google.com/maps/dir/?api=1&dir_action=navigate&destination=${lat},${lng}`;

  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.error("Don't know how to open URI: " + url);
    }
  });
};

export const openLink = (link) => {
  const url = link;
  Linking.openURL(url).catch((err) => {
    console.error("Don't know how to open URI: " + url);
  });
};
