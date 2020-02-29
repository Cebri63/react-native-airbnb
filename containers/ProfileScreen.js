import React, { useEffect, useState, useCallback } from "react";
import { useRoute } from "@react-navigation/core";
import {
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image,
  ActivityIndicator,
  StyleSheet,
  TextInput
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions"; // pour obtenir permission
import { ScrollView } from "react-native-gesture-handler";

export default function ProfileScreen({ setToken, setId }) {
  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(true);
  const [preview, setPreview] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");

  const { showActionSheetWithOptions } = useActionSheet();

  const handleImagePicked = useCallback(async pickerResult => {
    const id = await AsyncStorage.getItem("userId");
    const token = await AsyncStorage.getItem("userToken");

    let uploadResponse, uploadResult;
    try {
      setIsUploading(true);
      if (!pickerResult.cancelled) {
        const uri = pickerResult.uri;
        const uriParts = uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const formData = new FormData();
        formData.append("photo", {
          uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`
        });
        const options = {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
            "Content-Type": "multipart/form-data"
          }
        };
        uploadResponse = await fetch(
          `https://express-airbnb-api.herokuapp.com/user/upload_picture/${id}`,
          options
        );
        uploadResult = await uploadResponse.json();
        if (
          Array.isArray(uploadResult.photo) === true &&
          uploadResult.photo.length > 0
        ) {
          setImage(uploadResult.photo[0].url);
          alert("Photo mise à jour !");
        }
      }
    } catch (e) {
      alert("Une erreur est survenue");
    } finally {
      setPreview(false);
      setIsUploading(false);
    }
  });

  const handleUserUpdate = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("userToken");

      let data = new FormData();

      data.append("name", name);
      data.append("username", username);
      data.append("email", email);
      data.append("description", description);

      const response = await axios.put(
        `https://express-airbnb-api.herokuapp.com/user/update/${id}`,
        data,
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      setData(response.data);
      alert("Profil mis à jour !");
    } catch (error) {
      console.log("userUpdateError  ", error.message);
      alert("Une erreur est survenue");
    }
  };

  const _onOpenActionSheet = () => {
    const options = ["Take a photo", "From library", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      buttonIndex => {
        // Do something here depending on the button index selected
        if (buttonIndex === 0) {
          // take a photo => CAMERA
          takePhoto();
        }
        if (buttonIndex === 1) {
          // library
          takeLibraryImage();
        }
      }
    );
  };

  const takePhoto = async () => {
    const cameraPerm = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPerm = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // only if user allows permission to camera AND camera roll
    if (
      cameraPerm.status === "granted" &&
      cameraRollPerm.status === "granted"
    ) {
      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1]
      });
      // console.log(pickerResult);
      handleImagePicked(pickerResult);
      setImage(pickerResult.uri);
      setPreview(true);
    }
  };

  const takeLibraryImage = async () => {
    const cameraRollPerm = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // only if user allows permission to camera roll
    if (cameraRollPerm.status === "granted") {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1]
      });
      // console.log(pickerResult);
      handleImagePicked(pickerResult);
      setImage(pickerResult.uri);
      setPreview(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const id = await AsyncStorage.getItem("userId");

      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.id) {
          setData(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={_onOpenActionSheet}>
        {data.photo.length > 0 ? (
          <Image
            style={styles.image}
            source={{ uri: image || data.photo[0].url }}
          />
        ) : (
          <Ionicons name="ios-person" size={140} />
        )}
      </TouchableOpacity>

      <TextInput
        autoCapitalize="none"
        style={styles.textInput}
        placeholder="email"
        placeholderTextColor="#E1E1E1"
        onChangeText={text => setEmail(text)}
        defaultValue={data.email}
      />
      <TextInput
        style={styles.textInput}
        placeholder="username"
        placeholderTextColor="#E1E1E1"
        onChangeText={text => setUsername(text)}
        defaultValue={data.username}
      />
      <TextInput
        style={styles.textInput}
        placeholder="name"
        placeholderTextColor="#E1E1E1"
        onChangeText={text => setName(text)}
        defaultValue={data.name}
      />
      <TextInput
        multiline={true}
        numberOfLines={8}
        maxLength={200}
        style={styles.textArea}
        placeholder="description (max. 200 characters"
        placeholderTextColor="#E1E1E1"
        onChangeText={text => setDescription(text)}
        defaultValue={data.description}
      />

      <TouchableOpacity
        disabled={!name && !username && !email && !description ? true : false}
        style={styles.updateButton}
        onPress={handleUserUpdate}
      >
        <Text style={styles.updateButtonText}>Mettre à jour</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setToken(null);
          setId(null);
        }}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutButtonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center"
    // flex: 1
  },
  image: {
    height: 140,
    width: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: "#F35960"
  },
  textInput: {
    borderBottomColor: "#F35960",
    borderBottomWidth: 1,
    height: 45,
    width: "80%",
    paddingLeft: 15,
    marginVertical: 20,
    marginHorizontal: "10%"
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#F35960",
    width: "80%",
    height: 80,
    paddingHorizontal: 15,
    paddingTop: 15,
    textAlignVertical: "top",
    marginBottom: 20,
    marginHorizontal: "10%",
    borderRadius: 5
  },
  updateButton: {
    width: 150,
    height: 55,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#F35960",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30
  },
  logoutButton: {
    width: 150,
    height: 55,
    borderRadius: 50,
    backgroundColor: "#F35960",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30
  },
  logoutButtonText: {
    color: "white"
  },
  updateButtonText: {
    color: "#F35960"
  }
});
