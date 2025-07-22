import rsaApi from '../../api/rsa.js';
import React from 'react';
import { ScrollView, StyleSheet, TextInput, Alert, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, StatusBar } from 'react-native';
// import DatePicker from 'react-native-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faLongArrowUp, faSignOut } from '@fortawesome/free-solid-svg-icons';
//Components
import Colors from "../../constants/Colors";
import TextCatam from "../../components/TextCatamaran";

export default class ProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            loading: false,
            user: 0,
            name: '',
            birthday: '',
            address: '',
            city: '',
            email: '',
        }
    }

    async componentDidMount() {
        await this._loadProfile();
    };

    onChangeText = (key, val) => { this.setState({ [key]: val }); };

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('_token');
            if (value !== null) {
                return value;
            }
            this.props.navigation.navigate('Login');
        } catch (error) {
            console.log();
        }
    };

    _loadProfile = async () => {
        this.setState({ loading: true });
        try {
            const token = await this._retrieveData();
            this.rsaApi.getProfile(token).then(res => {
                if (!res.code) {
                    birthDate = res.birthday ? res.birthday.split('-') : '';
                    this.setState({
                        user: res.id,
                        name: res.name,
                        birthday: birthDate ? (birthDate[2] + '-' + birthDate[1] + '-' + birthDate[0]) : '',
                        address: res.address,
                        city: res.city,
                        email: res.email,
                        loading: false,
                    });
                } else {
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
    };

    updateProfile = async () => {
        this.setState({ loading: true });
        const { user, name, birthday, address, city } = this.state;

        try {
            const token = await this._retrieveData();

            var params = {
                user_id: user,
                name: name,
                birthday: birthday,
                address: address,
                city: city,
            };

            this.rsaApi.userUpdate(token, params).then(res => {
                if (!res.code) {
                    this.setState({ loading: false });
                    this._loadProfile();
                } else {
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
    };

    resetPass = async () => {
        await AsyncStorage.removeItem('_token', () => {
            this.props.navigation.navigate('ForgetPass');
        });
    }

    logout = async () => {
        await AsyncStorage.removeItem('_token', () => {
            this.props.navigation.navigate('Login');
        });
    };

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

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('More')}
                    style={styles.contentTitle}
                >
                    <View style={styles.btnBack}>
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.iconBack} />
                    </View>
                    <View style={styles.title}>
                        <TextCatam font='bold' others={styles.textTitle}>Perfil</TextCatam>
                    </View>
                </TouchableOpacity>

                <ScrollView style={styles.contentContainer}>

                    <View style={styles.contSubtitle}>
                        <TextCatam font='bold'>TUS DATOS</TextCatam>
                    </View>

                    <View style={styles.contSection}>
                        <TextCatam>Nombres</TextCatam>
                        <TextInput
                            value={this.state.name}
                            onChangeText={val => this.onChangeText('name', val)}
                            style={styles.inputText}
                        />
                        {/* <TextCatam>Fecha de Nacimiento</TextCatam> */}
                        {/* <DatePicker
                            style={{ width: '100%' }}
                            date={this.state.birthday}
                            mode="date"
                            placeholder="Seleccione fecha"
                            format="DD-MM-YYYY"
                            minDate="01-01-1960"
                            showIcon={false}
                            confirmBtnText="Confirmar"
                            cancelBtnText="Cancelar"
                            customStyles={{
                                dateInput: {
                                    fontFamily: 'catamaran',
                                    fontSize: 16,
                                    alignItems: 'stretch',
                                    borderWidth: 0,
                                    borderBottomWidth: 1,
                                    borderBottomColor: Colors.greenLight,
                                }
                            }}
                            onDateChange={val => this.onChangeText('birthday', val)}
                        /> */}
                        <TextCatam>Dirección</TextCatam>
                        <TextInput
                            autoCapitalize='characters'
                            value={this.state.address}
                            onChangeText={val => this.onChangeText('address', val)}
                            style={styles.inputText}
                        />
                        <TextCatam>Ciudad</TextCatam>
                        <TextInput
                            autoCapitalize='characters'
                            value={this.state.city}
                            onChangeText={val => this.onChangeText('city', val)}
                            style={styles.inputText}
                        />
                        <View style={styles.contBtn}>
                            <TouchableOpacity
                                onPress={this.updateProfile}
                                style={styles.btnSave}
                            >
                                <TextCatam font='bold' others={{ color: '#ffff' }}>GUARDAR</TextCatam>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.contSubtitle}>
                        <TextCatam font='bold'>CONFIGURACIÓN</TextCatam>
                    </View>

                    <View style={styles.contSection}>
                        <TextCatam>Email</TextCatam>
                        <TextInput
                            value={this.state.email}
                            onChangeText={val => this.onChangeText('email', val)}
                            style={styles.inputText}
                        />
                        <TextCatam>Contraseña</TextCatam>
                        <TouchableOpacity
                            onPress={this.resetPass}
                            style={styles.inputText}
                        >
                            <TextCatam>Cambiar contraseña</TextCatam>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.contLogout}>
                        <TouchableOpacity
                            onPress={this.logout}
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                            <FontAwesomeIcon icon={faSignOut} style={{color: Colors.greenDark, fontSize: 22, marginRight: 10}}/>
                            
                            <TextCatam font='bold' others={{ fontSize: 16, color: Colors.greenDark }}>SALIR DE RSA</TextCatam>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        );
    }
}

ProfileScreen.navigationOptions = {
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
        fontSize: 20,
        color: Colors.greenDark,
    },
    contSubtitle: {
        flex: 1,
        margin: 10,
    },
    contSection: {
        flex: 3,
        marginLeft: 20,
        marginRight: 20,
    },
    contLogout: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
    },
    inputText: {
        fontFamily: 'catamaran',
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greenLight,
    },
    contBtn: {
        marginTop: 10,
        marginBottom: 5,
        alignItems: 'center',
    },
    btnSave: {
        width: 100,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.greenDark,
        justifyContent: 'center',
        alignItems: 'center',
    }
});