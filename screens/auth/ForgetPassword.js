import rsaApi from '../../api/rsa.js';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, TextInput, TouchableOpacity, View, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import TextCatam from "../../components/TextCatamaran";
import Colors from "../../constants/Colors";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default class ForgetPassword extends React.Component {
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

    changeEmail = (text) => { this.setState({ email: text }) };

    onModalCorret = () => { this.props.navigation.navigate('SetPass') };

    onModalError = () => { this.setState({ modalError: false }) };

    _storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log();
        };
    };

    //Check email in Users
    sendEmail = async () => {
        this.setState({ loading: true });
        const { email } = this.state;

        try {
            var params = { email: email };

            this.rsaApi.verifyEmail(params).then(res => {
                if (!res.status) {
                    this._storeData('user', JSON.stringify(res.id));
                    this.setState({ loading: false });
                    this.props.navigation.navigate('SetPass', {screen: 'login'});
                } else {
                    var msg = '';
                    this.setState({ loading: false });
                    Object.values(res.validations).map(function (itemData, index) {
                        if (index === 0) { msg = itemData; } else { msg = msg + ' \n' + itemData; }
                    });
                    if (res.validations) { Alert.alert('Error', msg, [{ text: 'Cerrar' }]); }
                }
            });

        } catch (err) {
            Alert.alert('Error', err.message, [{ text: 'Cerrar' }]);
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
            <ImageBackground source={require('../../assets/images/back_rsa.png')} style={{ width: '100%', height: '100%' }}>
                <View style={styles.container}>
                    <View style={styles.content}>

                        <View style={styles.contLogo}>
                            <Image
                                source={require('../../assets/images/rsa_logo.png')}
                                style={styles.logo}
                            />
                        </View>

                        <View style={styles.contBody}>
                            <View style={styles.contText}>
                                <TextCatam font='ex-bold' others={styles.textLabel}>REESTRABLECER CONTRASEÑA</TextCatam>
                                <TextCatam>
                                    Al ingresar su dirección de correo electrónico,
                                    se le enviará un mail automático con un código aleatorio para que ingrese su nueva contraseña.
                                </TextCatam>
                            </View>
                            <View style={styles.contForm}>
                                <TextCatam font='bold'>Correo electrónico registrado</TextCatam>
                                <TextInput
                                    onChangeText={(text) => this.changeEmail(text)}
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    value={this.state.email}
                                    style={styles.inputEmail}
                                />

                                {this.renderBtn()}

                                <TouchableOpacity
                                    style={[styles.btnChange, {alignSelf: 'flex-start'}]}
                                    onPress={() => this.props.navigation.navigate('Login')}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} name='arrow-left' size={20} style={{color: Colors.greenDark}} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
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
    textLabel: {
        marginTop: 20,
        color: '#313e48',
        fontSize: 18,
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