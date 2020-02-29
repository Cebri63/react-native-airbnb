import React, { useState, useEffect } from "react";
import { View, Text, Platform } from "react-native";
import * as Permissions from "expo-permissions"; // pour obtenir permission
import * as Location from "expo-location"; // pour obtenir GPS
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";
import { useNavigation } from "@react-navigation/core";

const AroundMe = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const askPermission = async () => {
      // Demander permission
      const obj = await Permissions.askAsync(Permissions.LOCATION);
      if (obj.status === "granted") {
        // Obtenir GPS
        const location = await Location.getCurrentPositionAsync({});

        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        setIsLoading(false);
      } else {
        alert("You have to accept permission");
      }
    };

    askPermission();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://airbnb-api.herokuapp.com/api/room/around?latitude=${latitude}&longitude=${longitude}`
        );

        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (latitude && longitude) {
      fetchData();
    }
  }, [latitude, longitude]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {isLoading === false ? (
        <MapView
          showsUserLocation={true}
          provider={PROVIDER_GOOGLE}
          style={{
            width: "100%",
            flex: 1
          }}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15
          }}
        >
          {data.map((marker, index) => {
            return (
              <MapView.Marker
                key={marker._id}
                coordinate={{
                  latitude: marker.loc[1],
                  longitude: marker.loc[0]
                }}
              >
                <MapView.Callout
                  onPress={() =>
                    navigation.navigate("Room", { id: marker._id })
                  }
                >
                  <Text>{marker.title}</Text>
                </MapView.Callout>
              </MapView.Marker>
            );
          })}
        </MapView>
      ) : null}
    </View>
  );
};

export default AroundMe;
