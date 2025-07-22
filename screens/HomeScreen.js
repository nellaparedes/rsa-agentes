import rsaApi from '../api/rsa.js';
import React from 'react';
import { Platform, StatusBar, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import call from 'react-native-phone-call';
import ProgressCircle from 'react-native-progress-circle';

//Components
import Icon from "../components/IconCustom";
import TextCatam from "../components/TextCatamaran";
import Colors from "../constants/Colors";

//Test send expo push token
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import { faArrowRight, faArrowRotateForward, faBusinessTime, faContactCard, faPerson, faUser, faUsers, faUsersLine } from '@fortawesome/free-solid-svg-icons';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});
Notifications.setBadgeCountAsync(0);

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            loading: false,
            sales: 0,
            renovations: 0,
            comms_date: '',
            comms_pay: '',
            comms_pending: '',
            clients_total: 0,
            clients_inter: 0,
            clients_local: 0,
            clients_patri: 0,
            clients_prime: '',
            claims_total: 0,
            claims_int: 0,
            claims_loc: 0,
            claims_pat: 0,
            claims_sac: 0,
            claims_value: '',
            emrg_name_int: '',
            emrg_num_int: '',
            emrg_name_loc: '',
            emrg_num_loc: '',
            emrg_name_gen: '',
            emrg_num_gen: '',
            cont_question: '',
        }
    }

    componentDidMount() {
        this._notificationSubscription = Notifications.addNotificationResponseReceivedListener(
            this._handleNotificationResponse
        );
        this.sendPushToken();
        this.getHome();
    };

    _handleNotificationResponse = response => {
        this.props.navigation.navigate('Notifications');
    };

    componentWillUnmount() {
        this._notificationSubscription.remove();
    }

    async sendPushToken() {
        try {
            let pushtoken;
            if (Constants.isDevice) {
                const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    alert('Las notificaciones push han sido deshabilitadas.');
                    return;
                }

                pushtoken = (await Notifications.getExpoPushTokenAsync()).data;
            } else {
                alert('Las notificaciones push solo están disponibles en dispositivos físicos.');
            }
            
            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            const token = await AsyncStorage.getItem('_token');
            await this.rsaApi.sendPushtoken(token, {push_token: pushtoken});
            return;
        } catch (err) {
            Alert.alert('Error', err.message, [{ text: 'Cerrar' }]);
        };
    }

    getHome = async () => {
        this.setState({ loading: true });

        try {
            const token = await AsyncStorage.getItem('_token');
            this.rsaApi.getHome(token).then(res => {
                if (!res.code) {
                    this.setState({
                        sales: res.sales,
                        renovations: res.renovations,
                        comms_date: res.comms_date,
                        comms_pay: res.comms_pay,
                        comms_pending: res.comms_pending,
                        clients_total: res.clients_total,
                        clients_inter: res.clients_inter,
                        clients_local: res.clients_local,
                        clients_patri: res.clients_patri,
                        clients_prime: res.clients_prime,
                        claims_total: res.claims_total,
                        claims_int: res.claims_int,
                        claims_loc: res.claims_loc,
                        claims_pat: res.claims_pat,
                        claims_sac: res.claims_sac,
                        claims_value: res.claims_value,
                        emrg_name_int: res.emrg_name_int,
                        emrg_num_int: res.emrg_num_int,
                        emrg_name_loc: res.emrg_name_loc,
                        emrg_num_loc: res.emrg_num_loc,
                        emrg_name_gen: res.emrg_name_gen,
                        emrg_num_gen: res.emrg_num_gen,
                        cont_question: res.questions,
                        loading: false,
                    });
                } else {
                    if (res.code === 401 || res.code === 400) {
                        this.props.navigation.navigate('Login');
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

    toCall(num) {
        const args = { number: num, prompt: false };
        call(args).catch(console.error)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentBar} />
                <ScrollView style={styles.contentContainer}>

                    <View style={styles.contentBanner}>
                        <Image
                            source={require('../assets/images/rsa_logo.png')}
                            style={styles.logo}
                        />
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Profile')}
                        >
                            <FontAwesomeIcon icon={faUser} name='user' color={Colors.greenDark} styles={{ fontSize: 30, color: Colors.greenDark }} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.contentCumpl}>
                        <View style={styles.headerBox}>
                            <TextCatam font='bold' others={styles.textHeader}>Cumplimiento Comercial</TextCatam>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Compliance')}>
                                <TextCatam font='bold' others={styles.textHeader}>MÁS</TextCatam>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.boxCumpl}>
                            <View style={styles.infoCumpl}>
                                <ProgressCircle
                                    percent={this.state.sales}
                                    radius={20}
                                    borderWidth={4}
                                    color='#00863b'
                                    shadowColor='#efefef'
                                    bgColor="#fff"
                                    outerCircleStyle={{ marginRight: 8 }}
                                />
                                <View style={{ alignItems: 'center' }}>
                                    <TextCatam font='bold' others={styles.textPorcent}>{this.state.sales}%</TextCatam>
                                    <TextCatam font='bold' others={styles.textSales}>VENTAS</TextCatam>
                                </View>
                            </View>
                            <View style={styles.verticalLineTall}></View>
                            <View style={styles.infoCumpl}>
                                <ProgressCircle
                                    percent={this.state.renovations}
                                    radius={20}
                                    borderWidth={4}
                                    color='#82bb27'
                                    shadowColor='#efefef'
                                    bgColor="#fff"
                                    outerCircleStyle={{ marginRight: 8 }}
                                />
                                <View style={{ alignItems: 'center' }}>
                                    <TextCatam font='bold' others={styles.textPorcent}>{this.state.renovations}%</TextCatam>
                                    <TextCatam font='bold' others={styles.textRenew}>RENOVACIONES</TextCatam>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.contentComms}>
                        <View style={styles.headerBox}>
                            <TextCatam font='bold' others={styles.textHeader}>Comisiones</TextCatam>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Commissions')}>
                                <TextCatam font='bold' others={styles.textHeader}>MÁS</TextCatam>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TextCatam>{this.state.comms_date}</TextCatam>
                        </View>
                        <View style={styles.boxComms}>
                            <View style={styles.infoComms}>
                                <TextCatam font='bold' others={styles.valueComms}>$ {this.state.comms_pay}</TextCatam>
                                <TextCatam font='bold' others={styles.textSales}>PAGADAS</TextCatam>
                            </View>
                            <View style={styles.verticalLineTall}></View>
                            <View style={styles.infoComms}>
                                <TextCatam font='bold' others={styles.valueComms}>$ {this.state.comms_pending}</TextCatam>
                                <TextCatam font='bold' others={styles.textRenew}>POR COBRAR</TextCatam>
                            </View>
                        </View>
                    </View>

                    <View style={styles.contentFolio}>
                        <View style={styles.headerBox}>
                            <TextCatam font='bold' others={styles.textHeader}>Cartera Actual</TextCatam>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Folio')}>
                                <TextCatam font='bold' others={styles.textHeader}>MÁS</TextCatam>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.lineHrz} />
                        <View style={styles.boxFolio}>
                            <View style={styles.infoFolio}>
                                <Image
                                    source={require('../assets/images/amv_internacional.png')}
                                    style={styles.imgFolio}
                                />
                                <TextCatam font='bold' others={styles.numberFolio}>{this.state.clients_inter}</TextCatam>
                                <TextCatam>Clientes</TextCatam>
                                <TextCatam font='bold' others={styles.textFolio}>AMV Internacional</TextCatam>
                            </View>
                            <View style={styles.infoFolio}>
                                <Image
                                    source={require('../assets/images/amv_local.png')}
                                    style={styles.imgFolio}
                                />
                                <TextCatam font='bold' others={styles.numberFolio}>{this.state.clients_local}</TextCatam>
                                <TextCatam>Clientes</TextCatam>
                                <TextCatam font='bold' others={styles.textFolio}>AMV Local</TextCatam>
                            </View>
                            <View style={styles.infoFolio}>
                                <Image
                                    source={require('../assets/images/patrimonial.png')}
                                    style={styles.imgFolio}
                                />
                                <TextCatam font='bold' others={styles.numberFolio}>{this.state.clients_patri}</TextCatam>
                                <TextCatam>Clientes</TextCatam>
                                <TextCatam font='bold' others={styles.textFolio}>Patrimoniales</TextCatam>
                            </View>
                        </View>
                        <View style={styles.lineHrz} />
                        <View style={styles.boxFolio}>
                            <View style={styles.footFolio}>
                                <FontAwesomeIcon icon={faUsers} name="ios-contacts" style={{ fontSize: 18 }} />
                                <TextCatam font='bold'> {this.state.clients_total} </TextCatam>
                                <TextCatam others={{ fontSize: 12 }}>CLIENTES</TextCatam>
                            </View>
                            <View style={styles.verticalLineShort}></View>
                            <View style={styles.footFolio}>
                                <TextCatam others={{ fontSize: 12 }}>PRIMA: </TextCatam>
                                <TextCatam font='bold' others={styles.primeFootFolio}>$ {this.state.clients_prime}</TextCatam>
                            </View>
                        </View>
                    </View>

                    <View style={styles.contentClaims}>
                        <TouchableOpacity
                            style={styles.headerBox}
                            onPress={() => this.props.navigation.navigate('Claims')}
                        >
                            <TextCatam font='bold' others={styles.textHeader}>Reclamos en Curso</TextCatam>

                            <FontAwesomeIcon icon={faArrowRight} name="ios-arrow-forward" style={styles.iconArrow} />
                        </TouchableOpacity>
                        <View>
                            <View style={styles.boxClaims}>
                                <View style={styles.circleClaims}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{this.state.claims_total}</Text>
                                </View>
                                <View style={styles.infoClaims}>
                                    <View style={styles.colInfoClaims}>
                                        <FontAwesomeIcon icon={faPerson} name="md-person" style={{ fontSize: 14 }} />
                                        <Text font='bold' style={{ fontSize: 12 }}> {this.state.claims_int} </Text>
                                        <TextCatam others={{ fontSize: 12 }}>AMV Internacional</TextCatam>
                                    </View>
                                    <View style={styles.colInfoClaims}>
                                        <FontAwesomeIcon icon={faPerson} name="md-person" style={{ fontSize: 14 }} />
                                        <Text font='bold' style={{ fontSize: 12 }}> {this.state.claims_loc} </Text>
                                        <TextCatam others={{ fontSize: 12 }}>AMV Local</TextCatam>
                                    </View>
                                </View>
                                <View style={styles.infoClaims}>
                                    <View style={styles.colInfoClaims}>
                                        <FontAwesomeIcon icon={faBusinessTime} name="ios-business" style={{ fontSize: 16 }} />
                                        <Text font='bold' style={{ fontSize: 12 }}> {this.state.claims_pat} </Text>
                                        <TextCatam others={{ fontSize: 12 }}>Patrimoniales</TextCatam>
                                    </View>
                                    <View style={styles.colInfoClaims}>
                                        <Icon name='sac' styles={{ fontSize: 16 }} />
                                        <Text font='bold' style={{ fontSize: 12 }}> {this.state.claims_sac} </Text>
                                        <TextCatam others={{ fontSize: 12 }}>SAC</TextCatam>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.lineHrz} />
                            <View style={styles.footClaims}>
                                <TextCatam others={{ fontSize: 12 }}>VALOR REPORTADO: </TextCatam>
                                <TextCatam font='bold' others={styles.valueReport}>$ {this.state.claims_value}</TextCatam>
                            </View>
                        </View>
                    </View>

                    <View style={styles.contentEmerg}>
                        <View style={styles.headerBox}>
                            <TextCatam font='bold' others={styles.textHeader}>Emergencia</TextCatam>
                        </View>
                        <View style={styles.boxEmerg}>
                            <TouchableOpacity
                                onPress={() => this.toCall(this.state.emrg_num_int)}
                                style={styles.infoEmerg}
                            >
                                <Icon name='medical' styles={styles.iconsEmerg} />
                                <TextCatam others={{ fontSize: 12 }}>{this.state.emrg_name_int}</TextCatam>
                                <TextCatam font='bold' others={styles.numberEmerg}>{this.state.emrg_num_int}</TextCatam>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.toCall(this.state.emrg_num_loc)}
                                style={styles.infoEmerg}
                            >
                                <Icon name='asistencia' styles={styles.iconsEmerg} />
                                <TextCatam others={{ fontSize: 12 }}>{this.state.emrg_name_loc}</TextCatam>
                                <TextCatam font='bold' others={styles.numberEmerg}>{this.state.emrg_num_loc}</TextCatam>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.toCall(this.state.emrg_num_gen)}
                                style={styles.infoEmerg}
                            >
                                <Icon name='siniestro' styles={styles.iconsEmerg} />
                                <TextCatam others={{ fontSize: 12 }}>{this.state.emrg_name_gen}</TextCatam>
                                <TextCatam font='bold' others={styles.numberEmerg}>{this.state.emrg_num_gen}</TextCatam>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.lineHrz, { marginBottom: 0 }]} />
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Questions')}
                            style={styles.footEmerg}
                        >
                            <View style={styles.questionsFoot}>
                                <Icon name='faqs' styles={styles.iconsFootEmerg} />
                                <View style={styles.textQuestionFoot}>
                                    <TextCatam font='bold' others={styles.textFootEmerg}>PREGUNTAS FRECUENTES</TextCatam>
                                    <TextCatam others={{ fontSize: 12 }}>{this.state.cont_question} artículos</TextCatam>
                                </View>
                            </View>
                            <View style={styles.arrowFoot}>
                                <FontAwesomeIcon icon={faArrowRight} name="ios-arrow-forward" style={styles.iconArrow} />
                            </View>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        );
    }
}

HomeScreen.navigationOptions = {
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
        backgroundColor: '#00863b',
    },
    contentBanner: {
        flex: 1,
        marginLeft: 15,
        marginRight: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 50,
        resizeMode: 'contain',
    },
    headerBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    textHeader: {
        color: '#00863b',
    },
    verticalLineTall: {
        borderLeftWidth: 2,
        borderLeftColor: '#82bb27',
        height: 35,
    },
    verticalLineShort: {
        borderLeftWidth: 2,
        borderLeftColor: '#82bb27',
        height: 25,
    },
    //Cumplimiento
    contentCumpl: {
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#ffffff',
        elevation: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: "grey",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 5,
        padding: 15,
    },
    headerBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    textHeader: {
        color: '#00863b',
    },
    boxCumpl: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoCumpl: {
        flex: 1,
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textPorcent: {
        fontSize: 25,
    },
    textSales: {
        color: '#00863b',
        fontSize: 10,
    },
    textRenew: {
        color: '#82bb27',
        fontSize: 10,
    },
    //Comisiones
    contentComms: {
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#ffffff',
        elevation: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: "grey",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 5,
        padding: 15,
    },
    headerBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    textHeader: {
        color: '#00863b',
    },
    boxComms: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoComms: {
        flex: 1,
        width: '50%',
        flexDirection: 'column',
        alignItems: 'center',
    },
    valueComms: {
        fontSize: 20,
    },
    //Cartera Actual
    contentFolio: {
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: Colors.greyDark,
        borderRadius: 5,
        padding: 15,
    },
    boxFolio: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoFolio: {
        flex: 1,
        width: '33%',
        flexDirection: 'column',
        alignItems: 'center',
    },
    imgFolio: {
        width: 50,
        height: 50,
    },
    numberFolio: {
        color: '#00863b',
    },
    textFolio: {
        color: '#313e48',
        fontSize: 12,
        textAlign: 'center'
    },
    footFolio: {
        flex: 1,
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    primeFootFolio: {
        color: '#00863b',
        fontSize: 12,
    },
    //Reclamos
    contentClaims: {
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#ffffff',
        elevation: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: "grey",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 5,
        padding: 15,
    },
    boxClaims: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    circleClaims: {
        width: '20%',
        borderWidth: 4,
        borderColor: '#9fae84',
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoClaims: {
        flex: 1,
        width: '40%',
        flexDirection: 'column',
    },
    colInfoClaims: {
        flex: 1,
        margin: 10,
        flexDirection: 'row',
        alignContent: 'flex-start',
        alignItems: 'center',
    },
    footClaims: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    valueReport: {
        color: '#00863b',
        fontSize: 12,
    },
    iconArrow: {
        fontSize: 20,
        color: Colors.greenDark,
    },
    //Emergencia
    contentEmerg: {
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#ffffff',
        elevation: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: "grey",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 5,
        padding: 15,
    },
    boxEmerg: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    infoEmerg: {
        alignItems: 'center',
    },
    iconsEmerg: {
        color: '#00863b',
        fontWeight: 'bold',
        fontSize: 35,
    },
    numberEmerg: {
        color: '#313e48',
        fontSize: 12,
    },
    footEmerg: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.greyDark,
    },
    questionsFoot: {
        width: '90%',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 10,
    },
    arrowFoot: {
        width: '10%',
        justifyContent: 'center',
    },
    textQuestionFoot: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 15,
    },
    iconsFootEmerg: {
        color: '#00863b',
        fontWeight: 'bold',
        fontSize: 22,
    },
    textFootEmerg: {
        color: '#313e48',
        fontSize: 12,
    },
    lineHrz: {
        width: '100%',
        borderBottomWidth: 1,
        marginTop: 3,
        marginBottom: 3,
    }
});
