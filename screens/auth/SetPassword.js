import rsaApi from '../../api/rsa.js';
import React from 'react';
import { StyleSheet, Image, View, ImageBackground, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import TextCatam from "../../components/TextCatamaran";
import Colors from "../../constants/Colors";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default class SetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            loading: false,
            user: '',
            random: '',
            pass: '',
            rpass: '',
        };
    };

    onChangeText = (key, val) => { this.setState({ [key]: val }); };

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('user');
            if (value !== null) {
                this.setState({ user: value });
            }
        } catch (error) {
            console.log();
        }
    };

    componentDidMount = () => {
        this._retrieveData();
    }

    setPass = async () => {
        this.setState({ loading: true });
        const { user, random, pass, rpass } = this.state;

        try {
            var params = {
                user_id: user,
                random: random,
                password: pass,
                password_confirmation: rpass,
            };

            this.rsaApi.setPasswords(params).then(res => {
                if (!res.code) {
                    Alert.alert(
                        'Listo!',
                        'Inicia sesión con el correo y contraseña que has configurado',
                        [
                            {
                                text: 'Ir a login',
                                onPress: () => this.props.navigation.navigate('Login'),
                                style: { color: Colors.greenDark }
                            },
                        ],
                    );
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
    };

    renderBtn() {
        if (!this.state.loading) {
            return (
                <TouchableOpacity
                    style={styles.btnSave}
                    onPress={this.setPass}
                >
                    <TextCatam font='bold' others={{ color: 'white', fontSize: 16 }}>GUARDAR</TextCatam>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style={styles.btnSave}
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

                        <KeyboardAvoidingView style={styles.contBody} behavior="padding">
                            <TextCatam font='ex-bold' others={styles.textLabel}>CAMBIAR CONTRASEÑA</TextCatam>

                            <View style={styles.contentInputs}>
                                <TextInput
                                    placeholder='Código'
                                    style={styles.input}
                                    keyboardType='numeric' maxLength={4}
                                    onChangeText={val => this.onChangeText('random', val)}
                                />

                                <TextInput
                                    placeholder='Contraseña'
                                    style={styles.input}
                                    secureTextEntry={true}
                                    onChangeText={val => this.onChangeText('pass', val)}
                                />

                                <TextInput
                                    placeholder='Confirmar contraseña'
                                    style={styles.input}
                                    secureTextEntry={true}
                                    onChangeText={val => this.onChangeText('rpass', val)}
                                />
                            </View>

                            {this.renderBtn()}

                            <TouchableOpacity
                                style={[styles.btnChange, {alignSelf: 'flex-start'}]}
                                onPress={() => this.props.navigation.navigate('Login')}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} name='arrow-left' size={20} style={{color: Colors.greenDark}} />
                            </TouchableOpacity>
                        </KeyboardAvoidingView>

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
        alignItems: 'center',
    },
    logo: {
        width: 250,
        height: 150,
        resizeMode: 'contain',
    },
    textLabel: {
        marginTop: 20,
        color: '#313e48',
        fontSize: 18,
    },
    contentInputs: {
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'stretch',
    },
    input: {
        fontFamily: 'catamaran',
        fontSize: 16,
        alignSelf: 'stretch',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#82bb27',
        fontSize: 18,
    },
    btnSave: {
        width: 160,
        height: 40,
        marginTop: 20,
        marginBottom: 40,
        borderRadius: 20,
        backgroundColor: '#00863b',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnChange: {
        width: 40,
        height: 40,
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: Colors.greenLight,
        justifyContent: 'center',
        alignItems: 'center'
    }
});