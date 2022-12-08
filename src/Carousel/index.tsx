import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Animated, Image, Dimensions, ScrollView } from "react-native";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("screen");

const ITEM_WIDTH = width;
const ITEM_HEIGHT = height * 0.7;
const DOT_SIZE = 8;
const DOT_SPACING = 8;
const DOT_INDICATOR_SIZE = DOT_SIZE + DOT_SPACING;

const products = [
    {
        title: "VESTE À BOUTONNAGE CROISÉ OVERSIZE",
        description:
            "Blazer ample avec col à revers, manches longues et épaulettes. Poches avant à rabat. Fermeture à boutonnage croisé sur le devant.",
        image: "https://static.zara.net/photos///2022/V/0/1/p/2753/032/505/2/w/1126/2753032505_6_1_1.jpg?ts=1641547769209",
        price: "49,95 EUR",
    },
    {
        title: "PULL À CAPUCHE ET RAYURES EN MAILLE",
        description: "Pull avec col à capuche et manches longues.",
        image: "https://static.zara.net/photos///2022/I/0/1/p/9667/126/105/2/w/1126/9667126105_6_2_1.jpg?ts=1668424306937",
        price: "39,95 EUR",
    },
    {
        title: "PULL SOFT",
        description: "Pull à col montant et manches longues. Tissu au toucher doux.",
        image: "https://static.zara.net/photos///2022/I/0/1/p/0264/430/707/2/w/1126/0264430707_6_2_1.jpg?ts=1663597265240",
        price: "22,95 EUR",
    },
    {
        title: "BLOUSON DOUBLE FACE",
        description:
            "Blouson à col montant et manches longues. Poches à zip sur le devant. Passants et ceinture ton sur ton avec boucles en métal. Doublure ton sur ton. Fermeture zip métallique sur le devant.",
        image: "https://static.zara.net/photos///2022/I/0/1/p/2969/241/800/2/w/1126/2969241800_6_1_1.jpg?ts=1662480487020",
        price: "89,95 EUR",
    },
    {
        title: "PULL OVERSIZE EN MAILLE",
        description: "Pull à col montant et manches longues.",
        image: "https://static.zara.net/photos///2022/I/0/1/p/9598/266/800/2/w/1126/9598266800_6_2_1.jpg?ts=1667985370259",
        price: "39,95 EUR",
    },
];

export const Carousel = () => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [product, setProduct] = useState(0);
    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: ITEM_HEIGHT, overflow: "hidden" }}>
                <Animated.FlatList
                    data={products}
                    keyExtractor={(_, index) => index.toString()}
                    snapToInterval={ITEM_HEIGHT}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    decelerationRate="fast"
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                        useNativeDriver: true,
                    })}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.floor(
                            Math.floor(event.nativeEvent.contentOffset.y) /
                                Math.floor(event.nativeEvent.layoutMeasurement.height)
                        );
                        setProduct(index);
                    }}
                    renderItem={({ item }) => {
                        return (
                            <View>
                                <FastImage
                                    source={{
                                        uri: item.image,
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                    style={styles.image}
                                />
                            </View>
                        );
                    }}
                />
                <View style={styles.pagination}>
                    {products.map((_, i) => (
                        <View style={styles.dot} key={i} />
                    ))}
                    <Animated.View
                        style={[
                            styles.dotIndicator,
                            {
                                transform: [
                                    {
                                        translateY: Animated.divide(scrollY, ITEM_HEIGHT).interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, DOT_INDICATOR_SIZE],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />
                </View>
            </View>

            <View style={{ height: height - ITEM_HEIGHT, backgroundColor: "#fff", padding: 20 }}>
                <ScrollView contentContainerStyle={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "800", textTransform: "capitalize", color: "#000" }}>
                        {products[product].title}
                    </Text>
                    <Text style={{ fontSize: 16, color: "#000" }}>{products[product].price}</Text>
                    <Text style={{ marginVertical: 20, marginBottom: 10, lineHeight: 22, color: "#000" }}>
                        {products[product].description}
                    </Text>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        resizeMode: "cover",
    },
    pagination: {
        position: "absolute",
        top: ITEM_HEIGHT / 2.5,
        left: 20,
    },
    dot: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE,
        backgroundColor: "#333",
        marginBottom: DOT_SPACING,
    },
    dotIndicator: {
        width: DOT_INDICATOR_SIZE,
        height: DOT_INDICATOR_SIZE,
        borderRadius: DOT_INDICATOR_SIZE,
        borderWidth: 1,
        borderColor: "#333",
        position: "absolute",
        top: -DOT_SIZE / 2,
        left: -DOT_SIZE / 2,
    },
});
