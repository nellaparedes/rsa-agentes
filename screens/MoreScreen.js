import rsaApi from '../api/rsa.js';
import React from 'react';
import { Platform, StatusBar, StyleSheet, Image, TouchableOpacity, Alert, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

//Components
import Icon from "../components/IconCustom";
import Colors from "../constants/Colors";
import TextCatam from "../components/TextCatamaran";
import { faArrowRight, faBell, faBirthdayCake, faCubesStacked, faFileArrowUp, faFileVideo, faRss, faSackXmark, faUser, faUserAltSlash, faUserInjured, faUserPlus, faUserTie } from '@fortawesome/free-solid-svg-icons';
export default class MoreScreen extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            name: '',
            email: '',
            created: '',
        }
    }

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('_token');
            if (value !== null) {
                return value;
            }
            console.log(value);
            this.props.navigation.navigate('Login');
        } catch (error) {
            console.log();
        }
    };

    async componentDidMount() {
        try {
            const token = await this._retrieveData();
            this.rsaApi.getProfile(token).then(res => {
                if (!res.code) {
                    this.setState({
                        name: res.name,
                        email: res.email,
                        created: res.created,
                    });
                } else {
                    if (res.code === 401 || res.code === 400) {
                        AsyncStorage.removeItem('_token', () => {
                            this.props.navigation.navigate('Login');
                        });
                    } else {
                        var msg = '';
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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contBar} />

                <View style={styles.content}>
                    <View style={styles.contTitle}>
                        <TextCatam font='ex-bold' others={{ color: Colors.greenDark, fontSize: 20 }}>Más</TextCatam>
                    </View>

                    <View style={styles.contHead}>
                        <View style={styles.contLogo}>
                            <Image
                                source={require('../assets/images/rsa_logo.png')}
                                style={styles.logo}
                            />
                        </View>
                        <View style={styles.contProfile}>
                            <TextCatam font='ex-bold' others={{ fontSize: 14 }}>{this.state.name}</TextCatam>
                            <TextCatam font='bold' others={{ fontSize: 12 }}>{this.state.email}</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>Se unió hace {this.state.created}</TextCatam>
                        </View>
                    </View>

                    <View style={styles.contBody}>
                        <ScrollView>
                            <View style={styles.table}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Profile')}
                                    style={styles.row}
                                >
                                    <View style={styles.iconLeft}>
                                        <FontAwesomeIcon icon={faUser} name='user' styles={{ fontSize: 23 }} />
                                    </View>
                                    <View style={styles.textCenter}>
                                        <TextCatam others={{ fontSize: 14 }}>Perfil</TextCatam>
                                    </View>
                                    <View style={styles.iconRight}>
                                        <FontAwesomeIcon icon={faArrowRight} name='ios-arrow-forward' style={{ fontSize: 23, color: Colors.greenDark }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Potentials')}
                                    style={styles.row}
                                >
                                    <View style={styles.iconLeft}>
                                        <FontAwesomeIcon icon={faUserTie} name='user' styles={{ fontSize: 23 }} />
                                    </View>
                                    <View style={styles.textCenter}>
                                        <TextCatam others={{ fontSize: 14 }}>Mis clientes Potenciales</TextCatam>
                                    </View>
                                    <View style={styles.iconRight}>
                                        <FontAwesomeIcon icon={faArrowRight} name='ios-arrow-forward' style={{ fontSize: 23, color: Colors.greenDark }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Claims')}
                                    style={styles.row}
                                >
                                    <View style={styles.iconLeft}>
                                        <FontAwesomeIcon icon={faFileArrowUp} name='user' styles={{ fontSize: 23 }} />
                                    </View>
                                    <View style={styles.textCenter}>
                                        <TextCatam others={{ fontSize: 14 }}>Reclamos en Curso</TextCatam>
                                    </View>
                                    <View style={styles.iconRight}>
                                        <FontAwesomeIcon icon={faArrowRight} name='ios-arrow-forward' style={{ fontSize: 23, color: Colors.greenDark }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Sac')}
                                    style={styles.row}
                                >
                                    <View style={styles.iconLeft}>
                                        <FontAwesomeIcon icon={faSackXmark} name='user' styles={{ fontSize: 23 }} />
                                    </View>
                                    <View style={styles.textCenter}>
                                        <TextCatam others={{ fontSize: 14 }}>SAC</TextCatam>
                                    </View>
                                    <View style={styles.iconRight}>
                                        <FontAwesomeIcon icon={faArrowRight} name='ios-arrow-forward' style={{ fontSize: 23, color: Colors.greenDark }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => WebBrowser.openBrowserAsync('http://www.cotizador.rsa.ec')}
                                    style={styles.row}
                                >
                                    <View style={styles.iconLeft}>
                                        <FontAwesomeIcon icon={faRss} name='ios-arrow-forward' style={{ fontSize: 23, color: Colors.greenDark }} />
                                    </View>
                                    <View style={styles.textCenter}>
                                        <TextCatam others={{ fontSize: 14 }}>Cotizador en Línea</TextCatam>
                                    </View>
                                    <View style={styles.iconRight}>
                                        <FontAwesomeIcon icon={faArrowRight} name='ios-arrow-forward' style={{ fontSize: 23, color: Colors.greenDark }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Questions')}
                                    style={styles.row}
                                >
                                    <View style={styles.iconLeft}>
                                        <FontAwesomeIcon icon={faBirthdayCake} name='birthday-cake' style={{fontSize: 18}}/>
                                    </View>
                                    <View style={styles.textCenter}>
                                        <TextCatam others={{ fontSize: 14 }}>Preguntas Frecuentes</TextCatam>
                                    </View>
                                    <View style={styles.iconRight}>
                                        <FontAwesomeIcon icon={faArrowRight} name='ios-arrow-forward' style={{ fontSize: 23, color: Colors.greenDark }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Birthdays')}
                                    style={styles.row}
                                >
                                    <View style={styles.iconLeft}>
                                        <FontAwesomeIcon icon={faBirthdayCake} name='birthday-cake' style={{fontSize: 18}}/>
                                    </View>
                                    <View style={styles.textCenter}>
                                        <TextCatam others={{ fontSize: 14 }}>Cumpleaños</TextCatam>
                                    </View>
                                    <View style={styles.iconRight}>
                                        <FontAwesomeIcon icon={faArrowRight} name='ios-arrow-forward' style={{ fontSize: 23, color: Colors.greenDark }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Notifications')}
                                    style={styles.row}
                                >
                                    <View style={styles.iconLeft}>
                                        <FontAwesomeIcon icon={faBell} name='birthday-cake' style={{fontSize: 18}}/>
                                    </View>
                                    <View style={styles.textCenter}>
                                        <TextCatam others={{ fontSize: 14 }}>Notificaciones</TextCatam>
                                    </View>
                                    <View style={styles.iconRight}>
                                        <FontAwesomeIcon icon={faArrowRight} name='ios-arrow-forward' style={{ fontSize: 23, color: Colors.greenDark }} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
        );
    }
}

MoreScreen.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        marginLeft: 15,
        marginRight: 15,
    },
    contBar: {
        height: Platform.OS === 'ios' ? 55 : StatusBar.currentHeight,
        backgroundColor: Colors.greenDark,
    },
    contTitle: {
        height: 50,
        justifyContent: 'center',
    },
    contHead: {
        height: 100,
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.greenDark,
        flexDirection: 'row',
    },
    contBody: {
        flex: 2,
        justifyContent: 'center',
    },
    contLogo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contProfile: {
        flex: 2,
        justifyContent: 'center',
        paddingLeft: 20,
    },
    logo: {
        width: '90%',
        resizeMode: 'contain',
    },
    table: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        height: 40,
        flexDirection: 'row',
    },
    iconLeft: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textCenter: {
        width: '70%',
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    iconRight: {
        width: '10%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});