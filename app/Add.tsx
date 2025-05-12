import React, { useState, useEffect } from 'react';
import { Image, Text, TextInput, View, StyleSheet, Alert, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {MaterialCommunityIcons, } from "@expo/vector-icons";

type controleType = {
    id: string;
    nome: string;
    webHost: string;
};

export default function AddPage() {
    const [listaControle, setListaControle] = useState<controleType[]>([]);
    const [webHostValue, setWebHostValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const router = useRouter();

    const handleWebHostChange = (text: string) => {
        setWebHostValue(text);
    };

    const handleNameChange = (text: string) => {
        setNameValue(text);
    };

    const handleSendData = async () => {
        if (webHostValue.trim() === '' || nameValue.trim() === '') {
            Alert.alert('ATENÇÃO!', 'Preencha todos os campos!');
            return;
        }
        try {
            const newControle: controleType = {
                id: Date.now().toString(),
                nome: nameValue,
                webHost: webHostValue,
            };
            const updatedControle = [...listaControle, newControle];
            setListaControle(updatedControle);
            await AsyncStorage.setItem('controleList', JSON.stringify(updatedControle));
            Alert.alert('Controle do portão criado com sucesso!',)
            /*router.back();*/
        } catch (error) {
            console.error(error);
        }
    };
    const handleDelete = async (id: string) => {
        /*Alert.alert(
            'REMOVER',
            'Tem certeza que deseja excluir a tarefa?',
            [
                {
                    text: 'Não',
                    style: 'cancel',
                },
                {
                    text: 'Sim',
                    onPress: () => {*/
                        // Chama uma função async de verdade
                        confirmDelete(id);/*
                    },
                },
            ],
            { cancelable: false },
        );*/
    };

    const confirmDelete = async (id: string) => {
        try {
            const updatedControle = listaControle.filter(item => item.id !== id);
            setListaControle(updatedControle);
            await AsyncStorage.setItem('controleList', JSON.stringify(updatedControle));
            Alert.alert('Item deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar:', error);
        }
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

    const handlePressVoltar = () => {
        const checkIfValuesExist = async () => {
            try {
                const storedNameValue = await AsyncStorage.getItem('lastNameValue');
                const storedWebHostValue = await AsyncStorage.getItem('lastWebHostValue');
                if (!storedNameValue && !storedWebHostValue) {
                    router.back();
                } else {
                    Alert.alert('ATENÇÃO!', 'Adicione o controle para portão!');
                }
            } catch (error) {
                console.log(error);
            }
        };
        checkIfValuesExist();
    };

    return (
        <View style={styled.container}>
            <StatusBar backgroundColor="#021736"/>
            <Text style={styled.title}>
                Preencha os campos com os links
            </Text>
            <Text style={[styled.labelModal, { marginTop: 45 }]}>
                Digite o nome do portão:
            </Text>
            <TextInput style={styled.inputs} value={nameValue} maxLength={16} onChangeText={handleNameChange} />
            <Text style={styled.labelModal}>
                Digite o link da conexão:
            </Text>
            <TextInput style={styled.inputs} value={webHostValue} onChangeText={handleWebHostChange} />
            <View style={styled.constBt}>
                <TouchableOpacity style={styled.btSalvar} onPress={handleSendData}>
                    <Text style={styled.textApply}>
                        SALVAR
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styled.constainerScrollViewList}>
                {listaControle.length === 0 ? (
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Image /*style={styled.clipboard} source={itemsImg.clipboard} *//>
                        <MaterialCommunityIcons name="speaker-off" size={64} color="white" style={{marginTop: 20}} />
                        <Text style={styled.title3}>
                            Lista vazia!{'\n'}
                            Você ainda não tem um portão cadastrado.
                        </Text>
                    </View>
                ) : (
                    listaControle.map((item) => (
                        <View key={item.id} style={styled.listItem}>
                            <View style={styled.list}>
                                <Text style={styled.listTextNome} numberOfLines={1}>
                                    {item.nome}
                                </Text>
                            </View>
                            <TouchableOpacity style={styled.btDelet} onPress={() => handleDelete(item.id)}>
                                <MaterialCommunityIcons name="delete" size={24} color="#ffc800" />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
            <View style={styled.footer}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                        <TouchableOpacity /*onPress={handleClearAndChange}*/ >
                            <Text style={{ color: '#ffc800', fontSize: 14 }} >
                                APAGAR DADOS
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.55, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <TouchableOpacity onPress={handlePressVoltar}>
                            <Text style={{ color: '#ffc800', fontSize: 14 }}>
                                VOLTAR
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styled = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: '#021736',
    },
    title: {
        width: '100%',
        color: '#ffc800',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    labelModal: {
        color: 'white',
        marginTop: 17,
        fontSize: 13,
        lineHeight: 14,
    },
    inputs: {
        marginTop: 8,
        paddingHorizontal: 16,
        height: 43,
        borderRadius: 6,
        backgroundColor: '#fff',
        alignItems: 'center',
        fontSize: 16,
        color: '#444444',
    },
    constBt: {
        alignItems: 'center',
        padding: 20,
    },
    btSalvar: {
        width: 250,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffc800',
        borderRadius: 6,
    },
    textApply: {
        color: '#021736',
        fontSize: 16,
        fontWeight: 'bold',
    },
    constainerScrollViewList: {
        flex: 1,
        borderTopWidth: 1,
        borderColor: '#01244E',
    },
    title3: {
        flex: 1,
        color: 'white',
        fontSize: 14,
        lineHeight: 19.6,
        textAlign: 'center',
        fontWeight: '400',
        top: 12,
      },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#01244E',
        height: 50,
        borderRadius: 8,
        paddingEnd: 10,
        paddingStart: 20,
        marginTop: 6,
    },
    list: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: 300,
    },
    listTextNome: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    listTextWebHost: {
        color: 'white',
        fontSize: 13,
        marginStart: 12,
    },
    btDelet: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
    footer: {
        height: 60,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
});