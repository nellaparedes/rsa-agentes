import rsaApi from '../api/rsa.js';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, TextInput, TouchableOpacity, View, Alert, ImageBackground, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import TextCatam from "../components/TextCatamaran";
import Modal from '../components/CenterModal';
import Colors from "../constants/Colors";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default class VerifyEmail extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            loading: false,
            email: '',
            user_id: 0,
            modalCorrect: false,
            modalError: false,
        };
    }

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('screen');
            if (value !== null) {
                return value;
            }
            return null;
        } catch (error) {
            console.log();
        }
    };

    _storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log();
        };
    };

    changeEmail = (text) => { this.setState({ email: text }) };

    onModalCorret = () => { this.props.navigation.navigate('SetPass') };

    onModalError = () => { this.setState({ modalError: false }) };

    sendEmail = async () => {
        this.setState({ loading: true });
        const { email } = this.state;

        try {
            var params = { email: email };

            this.rsaApi.verifyEmail(params).then(res => {
                if (!res.status) {
                    this._storeData('user', JSON.stringify(res.id));
                    this.setState({ modalCorrect: true });
                } else {
                    switch (res.code) {
                        case 404:
                            this.setState({ modalError: true });
                            break;
                        default:
                            var msg = '';
                            Object.values(res.validations).map(function (itemData, index) {
                                if (index === 0) { msg = itemData; } else { msg = msg + ' \n' + itemData; }
                            });
                            if (res.validations) { Alert.alert('Error', msg, [{ text: 'Cerrar' }]); }
                            break;
                    }
                }
                this.setState({ loading: false });
            });

        } catch (err) {
            Alert.alert('Error', err, [{ text: 'Cerrar' }]);
        };
    }

    renderBtn() {
        if (!this.state.loading) {
            return (
                <TouchableOpacity
                    onPress={this.sendEmail}
                    style={styles.btnContinue}
                    disabled={this.state.loading}
                >
                    <TextCatam font='bold' others={styles.textBtn}>CONTINUAR</TextCatam>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style={styles.btnContinue}
                >
                    <ActivityIndicator size="small" color={Colors.greenLight} />
                </TouchableOpacity>
            );
        }
    }

    render() {
        return (
            <ImageBackground source={require('../assets/images/back_rsa.png')} style={{ width: '100%', height: '100%' }}>
                <View style={styles.container}>
                    <View style={styles.content}>

                        <View style={styles.contLogo}>
                            <Image
                                source={require('../assets/images/rsa_logo.png')}
                                style={styles.logo}
                            />
                        </View>

                        <KeyboardAvoidingView style={styles.contBody} behavior="padding">
                            <View style={styles.contText}>
                                <TextCatam>
                                    "Bienvenido a nuestra aplicación de agentes, creada para mantenernos
                                    comunicados con nuestros aliados comerciales más importantes."
                                </TextCatam>
                                <TextCatam>
                                    Recuerda que para ingresar a la APP RSA SEGUROS para agentes.
                                    Debes estar registrado en la base de datos de la Empresa.
                                </TextCatam>
                            </View>
                            <View style={styles.contForm}>
                                <TextCatam font='bold'>Ingrese su correo electrónico registrado</TextCatam>
                                <TextInput
                                    onChangeText={(text) => this.changeEmail(text)}
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    value={this.state.email}
                                    style={styles.inputEmail}
                                />

                                {this.renderBtn()}
                            </View>
                            <TouchableOpacity
                                style={[styles.btnChange, {alignSelf: 'flex-start'}]}
                                onPress={() => this.props.navigation.navigate('Login')}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} name='arrow-left' size={20} style={{color: Colors.greenDark}} />
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </View>

                    {/* Modal Correct */}
                    <Modal
                        style={modal.modal}
                        isOpen={this.state.modalCorrect}
                        position={"center"}
                        backdropPressToClose={false}
                    >
                        <View style={modal.contMsg}>
                            <TextCatam others={modal.textMessage}>
                                Tu registro se ha procesado con éxito!, por
                                seguridad te enviamos un correo a la
                                dirección electrónica registrada para concluir
                                la activación de la cuenta. Gracias por ser
                                parte de nuestra familia.
                            </TextCatam>
                        </View>
                        <View style={modal.lineHrz} />
                        <TouchableOpacity
                            onPress={this.onModalCorret}
                            style={modal.contBtn}
                        >
                            <TextCatam font='ex-bold' others={modal.textOk}>Salir</TextCatam>
                        </TouchableOpacity>
                    </Modal>

                    {/* Modal Error */}
                    <Modal
                        style={modal.modal}
                        isOpen={this.state.modalError}
                        position={"center"}
                        backdropPressToClose={false}
                    >
                        <View style={modal.contMsg}>
                            <TextCatam others={modal.textMessage}>
                                No pudimos gestionar tu solicitud, favor
                                confirma que la dirección de correo ingresada
                                esté correcta y sea la registrada en la base
                                de datos de RSA Seguros. Cualquier comentario
                                o sugerencia contáctanos a la dirección electrónica
                                <TextCatam font='bold'>{' '}sistemas@rsa.ec</TextCatam>
                            </TextCatam>
                        </View>
                        <View style={modal.lineHrz} />
                        <TouchableOpacity
                            onPress={this.onModalError}
                            style={modal.contBtn}
                        >
                            <TextCatam font='ex-bold' others={modal.textOk}>OK</TextCatam>
                        </TouchableOpacity>
                    </Modal>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 20,
        marginRight: 20,
    },
    contLogo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    contBody: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    contText: {
        marginTop: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    contForm: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    logo: {
        width: 250,
        height: 150,
        resizeMode: 'contain',
    },
    inputEmail: {
        fontFamily: 'catamaran',
        fontSize: 16,
        alignSelf: 'stretch',
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#82bb27',
        padding: 6,
    },
    btnContinue: {
        width: 130,
        height: 40,
        borderRadius: 20,
        marginTop: 20,
        marginBottom: 40,
        backgroundColor: '#00863b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtn: {
        color: 'white',
    },
    btnChange: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: Colors.greenLight,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const modal = StyleSheet.create({
    modal: {
        width: '80%',
        height: '40%',
    },
    contMsg: {
        flex: 5,
    },
    textMessage: {
        textAlign: "center",
        fontSize: 14,
        padding: 20,
    },
    contBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textOk: {
        fontSize: 20,
        color: '#82bb27',
    },
    lineHrz: {
        width: '100%',
        borderBottomWidth: 1,
        marginTop: 3,
        marginBottom: 3,
    }
});