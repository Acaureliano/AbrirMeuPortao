import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ImageBackground, StatusBar, Dimensions, NativeScrollEvent, NativeSyntheticEvent, } from 'react-native';
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native';


const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.5;
const ITEM_MARGIN = width * 0.045;
const SIDE_PADDING = (width - ITEM_WIDTH) / 2.5 - ITEM_MARGIN;

const itemsImg = {
    headerLogo: require('../assets/images/logo.png'),
    controle: require('../assets/images/controle.png'),
    bt: require('../assets/images/bt.png'),
}

type controleType = {
    id: string;
    nome: string;
    webHost: string;
};

export default function HomePage() {
    const [listaControle, setListaControle] = useState<controleType[]>([]);
    const [viewColor, setViewColor] = useState('#552323');
    const router = useRouter();

    const handlePressIn = () => {
		setViewColor('#ff0000'); // Cor da View quando o botão é pressionado
	};

	const handlePressOut = () => {
		setViewColor('#552323'); // Cor da View quando o botão é solto
	};

    const handlePressAdd = () => {
        router.push('/Add');
    };

    useEffect(() => {
        const loadControleList = async () => {
            try {
                const storedControleList = await AsyncStorage.getItem('controleList');
                if (storedControleList) {
                    setListaControle(JSON.parse(storedControleList));
                }
            } catch (error) {
                console.error(error);
            }
        };
        loadControleList();
    }, []);

    const [currentIndex, setCurrentIndex] = useState(0);

    const renderItem = ({ item }: { item: controleType }) => (
        <ImageBackground style={styled.controle}  source={itemsImg.controle} resizeMode="stretch" >
            <View style={styled.indicatorContainer}>
                <View style={[styled.indicatorRed, {backgroundColor: viewColor,}]} />
            </View>
            <View style={styled.contButton}>
                <TouchableOpacity style={styled.button} activeOpacity={0.8} onPressIn={handlePressIn} onPressOut={handlePressOut} >
                    <ImageBackground style={styled.button} source={itemsImg.bt}>
                        <MaterialIcons name="wifi-tethering" size={54} color="#231F20" />
                    </ImageBackground>
                </TouchableOpacity>
            </View>
            <Text style={styled.title}>
                {item.nome}
            </Text>
        </ImageBackground>
    );

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / (ITEM_WIDTH + ITEM_MARGIN * 2));
        setCurrentIndex(index);
    };

    return (
        <View style={styled.container}>
            <StatusBar backgroundColor="#01244E"/>
            <View style={styled.header}>
                <Image style={styled.logo} source={itemsImg.headerLogo}/>
            </View>
            {listaControle.length === 0 ? (
                <View style={[styled.containerControle1, {alignItems: 'center', justifyContent: 'center', position: 'absolute', paddingHorizontal: 20, }]}>
                    <MaterialCommunityIcons name="speaker-off" size={64} color="white" style={{marginTop: 20}} />
                    <Text style={[styled.title3, {top: 0}]}>
                        Não há controles salvos.{'\n'}
                        Clique no botão <Ionicons name="add-circle-sharp" size={20} color="#ffc800" /> para{'\n'}
                        adicionar um controle!
                    </Text>
                </View>
            ) : (
                <View style={styled.containerControle2}>
                    <FlatList
                        data={listaControle}
                        renderItem={renderItem}
                        keyExtractor={(_, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={ITEM_WIDTH + ITEM_MARGIN * 4}
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: SIDE_PADDING + ITEM_MARGIN, }}
                        ItemSeparatorComponent={() => <View style={{ width: ITEM_MARGIN * 2 }} />}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        style={{height: ITEM_WIDTH * 1.55, }}
                    />
                    <View style={styled.pagination}>
                        {listaControle.map((_, index) => (
                        <View
                            key={index}
                            style={[
                            styled.dot,
                            { opacity: currentIndex === index ? 1 : 0.3 },
                            ]}
                        />
                        ))}
                    </View>
                </View>
            )}
            <View style={styled.footer}>
                <View style={{ backgroundColor: '#021736', height: 13, flexDirection: 'row' }}>
                    <View style={{ backgroundColor: '#01244E', height: 13, width: 13, borderTopRightRadius: 100 }} />
                    <View style={{ backgroundColor: '#021736', height: 13, width: 64 }} />
                    <View style={{ backgroundColor: '#01244E', height: 13, width: 13, borderTopLeftRadius: 100 }} />
                </View>
            </View>
            <TouchableOpacity style={styled.containerBtAdd} onPress={handlePressAdd}>
                <MaterialIcons name="add" size={50} color="#021736" />
            </TouchableOpacity>
        </View>
    );
}

const styled = StyleSheet.create({
    container: {
        flex: 1,
        /*position: 'relative',*/
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#021736',
    },
    header: {
        top: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        height: 65,
        width: width,
        backgroundColor: '#01244E',
    },
    logo: {
        height: 50,
        width: 142,
        resizeMode: 'stretch',
    },
    containerControle1: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute', 
        width: width,
    },
    containerControle2: {
        alignItems: 'center',
        width: width,
    },
    animatedContainer: {
        flexDirection: 'row',
    },
    arrowButton: {
        padding: 10,
        zIndex: 1,
    },
    title3: {
        flex: 1,
        color: 'white',
        fontSize: 18,
        lineHeight: 30,
        textAlign: 'center',
        fontWeight: '400',
        top: 12,
    },
    controle: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: ITEM_WIDTH * 1.55,
        width: ITEM_WIDTH,
        paddingTop: 20,
        paddingBottom: 20,
        marginHorizontal: ITEM_MARGIN,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#797979FF',
        marginHorizontal: 5,
    },
    title: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        backgroundColor: '#231F20',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
        marginVertical: 20,
    },
    indicatorRed: {
        height: 15,
        width: 15,
        borderRadius: 10,
    },
    contButton: {
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    button: {
        height: 100,
        width: 100,
        backgroundColor: '#363636',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
    },
    containerBtAdd: {
        marginBottom: 20,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#ffc800',
        borderRadius: 100,
        height: 65,
        width: 65,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#021736',
    },
    footer: {
        bottom: 0,
        position: 'absolute',
        backgroundColor: '#01244E',
        height: 60,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
});