import rsaApi from '../../api/rsa.js';
import React from 'react';
import { Platform, StatusBar, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

//Components
import Colors from "../../constants/Colors";
import TextCatam from "../../components/TextCatamaran";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default class AddPotentialStep1 extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            loading: false,
            params: this.props.navigation.state.params.potential,
            jobs: [],
            name_contact1: '',
            job_contact1: '',
            name_contact2: '',
            job_contact2: '',
        }
        this.baseState = this.state
    }

    onChangeText = (key, val) => { this.setState({ [key]: val }) };

    async getToken() {
        try {
            const val_token = await AsyncStorage.getItem('_token');
            if (val_token != null) {
                return val_token;
            } else {
                this.props.navigation.navigate('Login');
            }
        } catch (error) {
            console.log();
        }
    }

    storePotential = async () => {
        this.setState({ loading: true });
        const token = await this.getToken();

        const { name_contact1, job_contact1, name_contact2, job_contact2 } = this.state;

        var contacts = {
            POT_CONTACTO_01: name_contact1,
            POT_CARGO_01: job_contact1,
            POT_CONTACTO_02: name_contact2,
            POT_CARGO_02: job_contact2,
        };

        const params = Object.assign(this.state.params, contacts);

        try {
            this.rsaApi.storePotential(token, params).then(res => {
                if (!res.code) {
                    this.setState({ loading: false });
                    Alert.alert('Correcto', 'Cliente guardado correctamente!', [{ text: 'Ok' }]);
                    this.props.navigation.navigate('Potentials');
                } else {
                    console.log(res);
                    if (res.code === 401 || res.code === 400) {
                        AsyncStorage.removeItem('_token', () => {
                            this.props.navigation.navigate('Login');
                        });
                    } else {
                        var msg = '';
                        this.setState({ loading: false });
                        Object.values(res.validations).map(function (itemData, index) {
                            if (index === 0) { msg = itemData; } else { msg = msg + ' \n' + itemData; }
                        });
                        if (res.validations) { Alert.alert('Error', msg, [{ text: 'Cerrar' }]); }
                    }
                }
            });
        } catch (err) {
            Alert.alert('Error', err.message, [{ text: 'Cerrar' }]);
        };
    }

    toCancel = () => {
        this.setState(this.baseState);
        this.props.navigation.navigate('Potentials');
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <View style={styles.contentBar}></View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={Colors.greenLight} />
                    </View>
                </View>
            );
        };

        return (
            <View style={styles.container}>

                <View style={styles.contentBar} />

                <View style={styles.contentTitle}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={styles.btnBack}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.iconBack} />
                    </TouchableOpacity>
                    <View style={styles.title}>
                        <TextCatam font='bold' others={styles.textTitle}>Agregar Cliente Potencial</TextCatam>
                    </View>
                </View>

                <View style={styles.contSubtitle}>
                    <TextCatam font='bold'>INFORMACIÓN DE CONTACTOS</TextCatam>
                </View>

                <View style={styles.contForm}>
                    <ScrollView style={styles.contentContainer}>
                        <View style={{ marginTop: 10, marginBottom: 10 }}>
                            <TextCatam font='bold' others={{ fontSize: 14 }}>Contacto 1</TextCatam>
                        </View>

                        <View style={{ flex: 1, marginBottom: 10 }}>
                            <TextCatam others={styles.label}>Nombre de contacto</TextCatam>
                            <TextInput
                                autoCapitalize='characters'
                                onChangeText={val => this.onChangeText('name_contact1', val)}
                                style={styles.inputText}
                            />
                        </View>
                        <View style={{ flex: 1, marginBottom: 10 }}>
                            <TextCatam others={styles.label}>Cargo</TextCatam>
                            <TextInput
                                autoCapitalize='characters'
                                onChangeText={val => this.onChangeText('job_contact1', val)}
                                style={styles.inputText}
                            />
                        </View>

                        <View style={{ marginTop: 10, marginBottom: 10 }}>
                            <TextCatam font='bold' others={{ fontSize: 14 }}>Contacto 2</TextCatam>
                        </View>

                        <View style={{ flex: 1, marginBottom: 10 }}>
                            <TextCatam others={styles.label}>Nombre de contacto</TextCatam>
                            <TextInput
                                autoCapitalize='characters'
                                onChangeText={val => this.onChangeText('name_contact2', val)}
                                style={styles.inputText}
                            />
                        </View>
                        <View style={{ flex: 1, marginBottom: 10 }}>
                            <TextCatam others={styles.label}>Cargo</TextCatam>
                            <TextInput
                                autoCapitalize='characters'
                                onChangeText={val => this.onChangeText('job_contact2', val)}
                                style={styles.inputText}
                            />
                        </View>

                        <View style={styles.contBtn}>
                            <TouchableOpacity
                                onPress={this.toCancel}
                                style={styles.btnCancel}
                            >
                                <TextCatam font='bold' others={{ color: Colors.greenDark }}>Cancelar</TextCatam>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={this.storePotential}
                                style={styles.btnNext}
                            >
                                <TextCatam font='bold' others={{ color: '#ffff' }}>Finalizar</TextCatam>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>

            </View>
        );
    }
}

AddPotentialStep1.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    contentBar: {
        height: Platform.OS === 'ios' ? 55 : StatusBar.currentHeight,
        backgroundColor: Colors.greenDark,
    },
    contentTitle: {
        height: 50,
        marginLeft: 10,
        marginRight: 10,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contSubtitle: {
        height: 30,
        margin: 10,
        alignItems: 'center',
    },
    contForm: {
        flex: 1,
        marginLeft: 15,
        marginRight: 15,
    },
    btnBack: {
        width: '10%',
        justifyContent: 'center',
    },
    iconBack: {
        fontSize: 25,
        color: Colors.greenDark,
    },
    title: {
        width: '90%',
        justifyContent: 'center',
    },
    textTitle: {
        fontSize: 18,
        color: Colors.greenDark,
    },
    label: {
        fontSize: 12,
    },
    inputText: {
        height: Platform.OS == 'ios' ? 38 : 30,
        fontFamily: 'catamaran',
        fontSize: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greenLight,
    },
    btnContact: {
        width: 150,
        height: 30,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.greenLight,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contBtn: {
        marginTop: 30,
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btnCancel: {
        width: 100,
        height: 30,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.greenDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnNext: {
        width: 100,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.greenDark,
        justifyContent: 'center',
        alignItems: 'center',
    }
});