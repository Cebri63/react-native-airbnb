import React from "react";
import { View, Text, ImageBackground, Image, StyleSheet } from "react-native";
import Carousel from "react-native-snap-carousel";

import Stars from "./Stars";

const RoomCard = ({ data, border }) => {
  _renderItem = ({ item, index }) => {
    return <Image style={styles.img} source={{ uri: item }} />;
  };
  return (
    <View style={[styles.container, { borderBottomWidth: border ? 1 : 0 }]}>
      {/* <ImageBackground style={styles.img} source={{ uri: data.photos[0] }}>
        <View style={styles.priceView}>
          <Text style={styles.price}>{data.price} €</Text>
        </View>
      </ImageBackground> */}
      <Carousel
        ref={c => {
          _carousel = c;
        }}
        data={data.photos}
        renderItem={_renderItem}
        sliderWidth={370}
        itemWidth={370}
        loop={true}
      />

      <View style={styles.titleAndProfileImg}>
        <View>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.starsAndReviews}>
            <Stars rating={data.ratingValue} />
            <Text style={styles.reviews}>{data.reviews} avis</Text>
          </View>
        </View>
        <Image
          style={styles.profileImg}
          source={{ uri: data.user.account.photos[0] }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderBottomColor: "#BBBBBB"
  },
  img: {
    height: 215
  },
  priceView: {
    height: 45,
    width: 70,
    backgroundColor: "black",
    position: "absolute",
    bottom: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  price: {
    color: "white",
    fontSize: 18
  },
  title: {
    fontSize: 18,
    marginBottom: 5
  },
  profileImg: {
    height: 60,
    width: 60,
    borderRadius: 30
  },
  titleAndProfileImg: {
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  starsAndReviews: {
    flexDirection: "row",
    alignItems: "center"
  },
  reviews: {
    fontSize: 18,
    color: "#BBBBBB",
    marginLeft: 10
  }
});

export default RoomCard;
