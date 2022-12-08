import React, { createRef, forwardRef, LegacyRef, Ref, useEffect, useRef, useState } from "react";
import { StatusBar, StyleSheet, Text, View, Dimensions, findNodeHandle, Animated, HostComponent } from "react-native";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("screen");
type MeasureType = { x: number; y: number; width: number; height: number };

const images: { [key: string]: string } = {
    man: "https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    women: "https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    kids: "https://images.pexels.com/photos/5080167/pexels-photo-5080167.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    skullcandy:
        "https://images.pexels.com/photos/5602879/pexels-photo-5602879.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    help: "https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
};
const data = Object.keys(images).map((i) => ({
    key: i,
    title: i,
    image: images[i],
    ref: createRef<View>(),
}));

const Tab = forwardRef<{}, { title: string }>(({ title }, ref) => {
    return (
        <View ref={ref as LegacyRef<View>}>
            <Text style={{ color: "#FFF", fontSize: 84 / data.length, fontWeight: "800", textTransform: "uppercase" }}>
                {title}
            </Text>
        </View>
    );
});

const Indicator = ({ measures, scrollX }: { measures: MeasureType[]; scrollX: Animated.Value }) => {
    const inputRange = data.map((_, i) => i * width);
    const indicatorWidth = scrollX.interpolate({
        inputRange,
        outputRange: measures.map((measure) => measure.width),
    });
    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: measures.map((measure) => measure.x),
    });
    return (
        <Animated.View
            style={{
                position: "absolute",
                height: 4,
                width: indicatorWidth,
                left: 0,
                backgroundColor: "white",
                bottom: -10,
                transform: [{ translateX }],
            }}
        />
    );
};

const Tabs = ({
    data,
    scrollX,
}: {
    data: { key: string; title: string; image: string; ref: React.RefObject<View> }[];
    scrollX: Animated.Value;
}) => {
    const [measures, setMeasures] = useState<MeasureType[]>([]);
    const containerRef = useRef<View>(null);

    useEffect(() => {
        const m: MeasureType[] = [];
        if (containerRef.current) {
            data.forEach((item) => {
                item.ref.current?.measureLayout(
                    // @ts-ignore
                    containerRef.current,
                    (x, y, width, height) => {
                        m.push({ x, y, width, height });
                        if (m.length === data.length) {
                            setMeasures(m);
                        }
                    },
                    console.error
                );
            });
        }
    }, [containerRef]);

    return (
        <View style={{ position: "absolute", top: 100, width }} ref={containerRef}>
            <View style={{ justifyContent: "space-evenly", flex: 1, flexDirection: "row" }}>
                {data.map((item) => {
                    const { key, title, ref } = item;
                    return <Tab key={key} title={title} ref={ref} />;
                })}
            </View>
            {measures.length > 0 && <Indicator scrollX={scrollX} measures={measures} />}
        </View>
    );
};

export const AnimatedTabsIncator = () => {
    const scrollX = useRef(new Animated.Value(0)).current;
    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Animated.FlatList
                data={data}
                keyExtractor={(item) => item.key}
                horizontal
                pagingEnabled
                bounces={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                })}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ width, height }}>
                            <FastImage
                                source={{
                                    uri: item.image,
                                    priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                                style={{ flex: 1 }}
                            />
                            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,.5)" }]}></View>
                        </View>
                    );
                }}
            />
            <Tabs data={data} scrollX={scrollX} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
