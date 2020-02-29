import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView
} from "react-native";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SingUpScreen({ setToken, setId }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    try {
      if (password !== confirmPassword) {
        alert("Les mots de passe ne sont pas identiques");
      } else {
        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/sign_up",
          { email, name, username, description, password }
        );
        console.log(response.data);

        if (response.data.token) {
          setToken(response.data.token);
          setId(response.data.id);
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <ScrollView bounces={false} contentContainerStyle={styles.container}>
      <KeyboardAwareScrollView extraScrollHeight={110}>
        <SafeAreaView>
          <View style={styles.inner}>
            <Text style={styles.title}>Rejoignez-nous !</Text>
            <TextInput
              autoCapitalize="none"
              style={styles.textInput}
              placeholder="email"
              placeholderTextColor="#E1E1E1"
              onChangeText={text => setEmail(text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="username"
              placeholderTextColor="#E1E1E1"
              onChangeText={text => setUsername(text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="name"
              placeholderTextColor="#E1E1E1"
              onChangeText={text => setName(text)}
            />
            <TextInput
              multiline={true}
              numberOfLines={8}
              maxLength={200}
              style={styles.textArea}
              placeholder="description (max. 200 characters"
              placeholderTextColor="#E1E1E1"
              onChangeText={text => setDescription(text)}
            />
            <TextInput
              autoCapitalize="none"
              style={styles.textInput}
              placeholder="password"
              placeholderTextColor="#E1E1E1"
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
            />
            <TextInput
              autoCapitalize="none"
              style={styles.textInput}
              placeholder="confirm password"
              placeholderTextColor="#E1E1E1"
              secureTextEntry={true}
              onChangeText={text => setConfirmPassword(text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}> S'inscrire</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignIn");
              }}
            >
              <Text style={styles.underButton}>
                Déjà un compte ? Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F35960",
    alignItems: "center",
    justifyContent: "center"
  },
  inner: {
    padding: 24,
    flex: 1,
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    color: "white",
    marginVertical: 20
  },
  button: {
    width: 190,
    height: 65,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50
  },
  buttonText: {
    color: "#F35960",
    fontSize: 24
  },
  underButton: {
    marginTop: 15,
    color: "white",
    textDecorationLine: "underline"
  },
  textInput: {
    borderBottomColor: "white",
    borderBottomWidth: 1,
    width: 330,
    height: 45,
    marginBottom: 30,
    paddingLeft: 15,
    color: "white"
  },
  textArea: {
    width: 330,
    height: 80,
    borderColor: "white",
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
    textAlignVertical: "top",
    color: "white",
    marginBottom: 20
  }
});
