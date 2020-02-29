import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
// import { Constants } from "expo";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
// To use the following code in your project, you have to install expo-permissions and expo-image-picker:
// expo install expo-permissions
// expo install expo-image-picker
export default function App() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const handleImagePicked = useCallback(async pickerResult => {
    let uploadResponse, uploadResult;
    try {
      setUploading(true);
      if (!pickerResult.cancelled) {
        // Note:
        // Uncomment this if you want to experiment with local server
        //
        // if (Constants.isDevice) {
        //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
        // } else {
        //   apiUrl = `http://localhost:3000/upload`
        // }
        const uri = pickerResult.uri;
        const uriParts = uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const formData = new FormData();
        formData.append("picture", {
          uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`
        });
        const options = {
          method: "POST",
          body: formData,
          headers: {
            Authorization: "Bearer KbGrJosUZSNMwJaa",
            Accept: "application/json",
            "Content-Type": "multipart/form-data"
          }
        };
        uploadResponse = await fetch(
          "https://airbnb-api.herokuapp.com/api/user/upload_picture",
          options
        );
        uploadResult = await uploadResponse.json();
        console.log(uploadResult);
        if (Array.isArray(uploadResult) === true && uploadResult.length > 0) {
          setImage(uploadResult[0]);
        }
      }
    } catch (e) {
      // console.log({ uploadResponse });
      // console.log({ uploadResult });
      // console.log({ e });
      alert("Upload failed, sorry :(");
    } finally {
      setUploading(false);
    }
  });
  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="default" />
      <Text style={styles.exampleText}>Example: Upload ImagePicker result</Text>
      <Button
        onPress={async () => {
          const cameraRollPerm = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
          );
          // only if user allows permission to camera roll
          if (cameraRollPerm.status === "granted") {
            const pickerResult = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [4, 3]
            });
            handleImagePicked(pickerResult);
          }
        }}
        title="Pick an image from camera roll"
      />
      <Button
        onPress={async () => {
          const cameraPerm = await Permissions.askAsync(Permissions.CAMERA);
          const cameraRollPerm = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
          );
          // only if user allows permission to camera AND camera roll
          if (
            cameraPerm.status === "granted" &&
            cameraRollPerm.status === "granted"
          ) {
            const pickerResult = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [4, 3]
            });
            handleImagePicked(pickerResult);
          }
        }}
        title="Take a photo"
      />
      {image && (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
          <Text
            onPress={() => {
              Clipboard.setString(image);
              alert("Copied image URL to clipboard");
            }}
            style={styles.imageText}
          >
            {image}
          </Text>
        </View>
      )}
      {uploading && (
        <View style={[StyleSheet.absoluteFill, styles.uploading]}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  exampleText: {
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 15,
    textAlign: "center"
  },
  uploading: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center"
  },
  container: {
    borderRadius: 3,
    marginTop: 30,
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 4,
      width: 4
    },
    shadowRadius: 5,
    width: 250
  },
  imageContainer: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: "hidden"
  },
  image: {
    height: 250,
    width: 250
  },
  imageText: {
    paddingHorizontal: 10,
    paddingVertical: 10
  }
});
