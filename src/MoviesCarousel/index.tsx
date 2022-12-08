import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Animated, FlatList, StatusBar, Platform } from "react-native";
import FastImage from "react-native-fast-image";
import { getMovies } from "./data";
import Genres from "./Genres";
import Rating from "./Rating";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, { Rect } from "react-native-svg";

const { width, height } = Dimensions.get("window");
const SPACING = 10;
const ITEM_SIZE = width * 0.75;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.6;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const Loading = () => (
    <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
    </View>
);

type MovieType = {
    key: string;
    poster?: string;
    title?: string;
    rating?: number;
    description?: string;
    backdrop?: string;
};

const Backdrop = ({ movies, scrollX }: { movies: MovieType[]; scrollX: Animated.Value }) => {
    return (
        <View style={{ position: "absolute", width, height: BACKDROP_HEIGHT, overflow: "hidden" }}>
            <FlatList
                data={movies.reverse()}
                keyExtractor={(item) => item.key + "-backdrop"}
                removeClippedSubviews={false}
                contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
                renderItem={({ item, index }) => {
                    if (!item.backdrop) {
                        return null;
                    }

                    const translateX = scrollX.interpolate({
                        inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
                        outputRange: [0, width],
                    });

                    return (
                        <MaskedView
                            key={index}
                            style={{
                                position: "absolute",
                            }}
                            removeClippedSubviews={false}
                            maskElement={
                                <AnimatedSvg
                                    width={width}
                                    height={height}
                                    viewBox={`0 0 ${width} ${height}`}
                                    style={{ transform: [{ translateX }] }}
                                >
                                    <Rect x="0" y="0" width={width} height={height} fill="red" />
                                </AnimatedSvg>
                            }
                        >
                            <FastImage
                                source={{
                                    uri: item.backdrop,
                                    priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                                style={{ width, height: BACKDROP_HEIGHT, position: "absolute" }}
                            />
                        </MaskedView>
                    );
                }}
            />
            <LinearGradient
                colors={["rgba(0, 0, 0, 0)", "white"]}
                style={{
                    height: BACKDROP_HEIGHT,
                    width,
                    position: "absolute",
                    bottom: 0,
                }}
            />
        </View>
    );
};

export const MoviesCarousel = () => {
    const [movies, setMovies] = useState<MovieType[]>([]);
    const scrollX = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchMovies = async () => {
            const m = await getMovies();
            setMovies([{ key: "left-spacer" }, ...m, { key: "right-spacer" }]);
        };

        fetchMovies();
    }, []);

    if (movies.length === 0) return <Loading />;

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Backdrop movies={movies} scrollX={scrollX} />
            <Animated.FlatList
                showsHorizontalScrollIndicator={false}
                data={movies}
                snapToInterval={ITEM_SIZE}
                bounces={false}
                decelerationRate={Platform.OS === "ios" ? 0 : 0.98}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: true,
                })}
                renderToHardwareTextureAndroid
                snapToAlignment={"start"}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => {
                    const inputRange = [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE, index * ITEM_SIZE];
                    const translateY = scrollX.interpolate({
                        inputRange,
                        outputRange: [100, -50, 100],
                    });

                    if (!item.rating) return <View style={{ width: SPACER_ITEM_SIZE }} />;

                    return (
                        <View style={{ width: ITEM_SIZE }}>
                            <Animated.View
                                style={{
                                    marginHorizontal: SPACING,
                                    padding: SPACING * 2,
                                    alignItems: "center",
                                    backgroundColor: "#FFF",
                                    borderRadius: 34,
                                    transform: [{ translateY }],
                                }}
                            >
                                <FastImage
                                    source={{
                                        uri: item.poster,
                                        priority: FastImage.priority.high,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                    style={styles.posterImage}
                                />
                                <Text numberOfLines={1} style={{ fontSize: 24, color: "#000" }}>
                                    {item.title}
                                </Text>
                                <Rating rating={item.rating} />
                                <Text style={{ fontSize: 12 }} numberOfLines={3}>
                                    {item.description}
                                </Text>
                            </Animated.View>
                        </View>
                    );
                }}
                keyExtractor={(item) => item.key}
                contentContainerStyle={{ alignItems: "center" }}
                horizontal
            />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    posterImage: {
        width: "100%",
        height: ITEM_SIZE * 1.2,
        resizeMode: "cover",
        borderRadius: 24,
        margin: 0,
        marginBottom: 10,
    },
});
