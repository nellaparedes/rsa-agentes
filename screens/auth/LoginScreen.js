import rsaApi from '../../api/rsa.js';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Image, View, Switch, ImageBackground, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextCatam from "../../components/TextCatamaran";
import Colors from "../../constants/Colors";

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            loading: false,
            validateToken: true,
            email: '',
            pass: '',
            type: 'agent',
            switchValue: true,
        };
    }

    onChangeText = (key, val) => { this.setState({ [key]: val }) };

    toggleSwitch = () => { this.setState({ switchValue: !this.state.switchValue }) };

    _storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log();
        };
    };

    componentDidMount() {
        this._validateLogin();
    };

    _validateLogin = async () => {
        try {
            const token = await AsyncStorage.getItem('_token');
            const remember = await AsyncStorage.getItem('_remember');

            if (remember && remember === 'true') {
                if (token !== null) {
                    this.rsaApi.userIsLogin(token).then(res => {
                        if (res.status == 200) {
                            this.props.navigation.navigate('Main');
                        } else {
                            AsyncStorage.removeItem('_token');
                            this.setState({ validateToken: false });
                        };
                    });
                } else {
                    this.setState({ validateToken: false });
                };
            } else {
                this.setState({ validateToken: false });
            };
        } catch (error) {
            console.log('Error: catch login');
            console.log(error);
        };
    };

    //Access to app
    signIn = async () => {
        this.setState({ loading: true });
        const { email, pass, type } = this.state;

        try {
            var params = { email: email, password: pass, type: type };

            this.rsaApi.loginUser(params).then(res => {
                if (!res.code) {
                    this._storeData('_token', res.token);
                    this._storeData('_remember', this.state.switchValue ? 'true' : 'false');
                    this.setState({ loading: false });
                    this.props.navigation.navigate('Main');
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
                    style={styles.btnEnter}
                    onPress={this.signIn}
                >
                    <TextCatam font='bold' others={styles.textBtnEnter}>ENTRAR</TextCatam>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style={styles.btnEnter}
                >
                    <ActivityIndicator size="small" color={Colors.greenLight} />
                </TouchableOpacity>
            );
        }
    }

    render() {
        if (this.state.validateToken) {
            return (
                <ImageBackground source={require('../../assets/images/back_rsa.png')} style={{ width: '100%', height: '100%' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={Colors.greenLight} />
                        <TextCatam font='bold' others={{ fontSize: 20, color: Colors.greenLight }}>Iniciando...</TextCatam>
                    </View>
                </ImageBackground>
            );
        };

        return (
            <ImageBackground source={require('../../assets/images/back_rsa.png')} style={{ width: '100%', height: '100%' }}>
                <View style={styles.container}>
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

                        <View style={styles.welcomeContainer}>
                            <Image
                                source={require('../../assets/images/rsa_logo.png')}
                                style={styles.welcomeImage}
                            />
                        </View >

                        <View style={styles.contentForm}>
                            <View style={styles.contInputs}>
                                <TextInput
                                    placeholder='Email'
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    style={styles.input}
                                    onChangeText={val => this.onChangeText('email', val)}
                                />
                                <TextInput
                                    placeholder='Contraseña'
                                    autoCapitalize='none'
                                    style={styles.input}
                                    secureTextEntry={true}
                                    onChangeText={val => this.onChangeText('pass', val)}
                                />
                            </View>
                            <View style={styles.contSwtich}>
                                <Switch
                                    style={
                                        Platform.OS === 'ios'
                                            ? { transform: [{ scaleX: .6 }, { scaleY: .6 }], marginRight: 10 }
                                            : { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], marginRight: 10 }
                                    }
                                    thumbColor={Colors.greenDark}
                                    ios_backgroundColor={Colors.greyDark}
                                    onValueChange={this.toggleSwitch}
                                    value={this.state.switchValue}
                                />
                                <TextCatam>{this.state.switchValue ? 'Recordar Usuario' : 'No Recordar Usuario'}</TextCatam>
                            </View>
                            <View style={styles.contForget}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('ForgetPass')}
                                >
                                    <TextCatam font='bold' others={styles.textForget}>Olvide mi contraseña</TextCatam>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.contentBtn}>
                            {this.renderBtn()}

                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Verify')}
                            >
                                <TextCatam font='bold' others={{ color: Colors.greenDark }}>
                                    REGISTRARSE
                                </TextCatam>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    welcomeContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    welcomeImage: {
        width: 250,
        height: 150,
        resizeMode: 'contain',
    },
    contentForm: {
        flex: 1,
        justifyContent: "center",
    },
    contInputs: {
        flex: 2,
        marginLeft: 25,
        marginRight: 25,
        justifyContent: 'space-around',
    },
    contSwtich: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15,
    },
    contForget: {
        flex: 1,
        marginLeft: 25,
        marginRight: 25,
    },
    input: {
        fontFamily: 'catamaran',
        fontSize: 18,
        borderBottomWidth: 2,
        borderBottomColor: '#82bb27',
    },
    textForget: {
        color: '#00863b',
        fontSize: 16,
    },
    contentBtn: {
        flex: 1,
        alignItems: 'center',
    },
    btnEnter: {
        marginTop: 50,
        width: 200,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#00863b',
        justifyContent: 'center',
        marginBottom: 20,
    },
    textBtnEnter: {
        color: 'white',
        textAlign: 'center'
    },
    textBtnRegister: {
        color: '#00863b',
        textAlign: 'center'
    },
});
