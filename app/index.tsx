import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions, StatusBar, } from 'react-native';
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native';

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

const { width } = Dimensions.get('window');

export default function HomePage() {
    const [listaControle, setListaControle] = useState<controleType[]>([]);
    const [viewColor, setViewColor] = useState('#552323');
    const router = useRouter();
    const ITEM_WIDTH = width / 2;
    const VISIBLE_PART = ITEM_WIDTH / 6;
    const SIDE_PADDING = (width - ITEM_WIDTH) / 3;

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

    return (
        <View style={styled.container}>
            <StatusBar backgroundColor="#01244E"/>
            <View style={styled.header}>
                <Image style={styled.logo} source={itemsImg.headerLogo}/>
            </View>
            {listaControle.length > 0 && (
                <View style={styled.containerControle}>
                    <FlatList
                        data={listaControle}
                        keyExtractor={(item) => item.id}
                        horizontal
                        pagingEnabled
                        snapToInterval={ITEM_WIDTH + VISIBLE_PART * 2}
                        decelerationRate="fast"
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: SIDE_PADDING,
                        }}
                        renderItem={({ item }) => (
                            <ImageBackground style={[styled.controle, { width: ITEM_WIDTH, marginHorizontal: VISIBLE_PART, }]}  source={itemsImg.controle}>
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
                        )}
                    />
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
    containerControle: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        flex: 1,
    },
    animatedContainer: {
        flexDirection: 'row',
    },
    arrowButton: {
        padding: 10,
        zIndex: 1,
    },
    controle: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 300,
        width: width / 2,
        /*backgroundColor: '#141414',*/
        /*borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,*/
        paddingTop: 20,
        paddingBottom: 20,
        marginHorizontal: width / 9,
        resizeMode: 'cover',
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