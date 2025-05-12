import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated, Dimensions, StatusBar, } from 'react-native';
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native';

type controleType = {
    id: string;
    nome: string;
    webHost: string;
};

const { width } = Dimensions.get('window');

export default function HomePage() {
    const [listaControle, setListaControle] = useState<controleType[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();
    const translateX = useRef(new Animated.Value(0)).current;
    const ITEM_WIDTH = width / 2;
    const VISIBLE_PART = ITEM_WIDTH / 6;
    const SIDE_PADDING = (width - ITEM_WIDTH) / 3
    
    const screenWidth = Dimensions.get('window').width;
    const squareSize = screenWidth / 4;


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
            <View style={styled.header}>
                <Text style={{color: "white"}}>
                    LigaMeuPortão
                </Text>
            </View>
            <StatusBar backgroundColor="#1E3254"/>
            <View style={styled.containerControle}>
                <View style={[styled.controle, { width: squareSize, height: squareSize }]} />
            </View>
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
        position: 'relative',
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
    containerControle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        backgroundColor: 'white',
    },
    title: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        backgroundColor: '#383838',
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
        backgroundColor: '#552323FF',
        borderRadius: 10,
    },
    contButton: {
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        height: 108,
        width: 108,
    },
    button: {
        height: 100,
        width: 100,
        backgroundColor: '#404040',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
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