import rsaApi from '../../api/rsa.js';
import React from 'react';
import { ScrollView, Platform, StatusBar, StyleSheet, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Components
import Colors from "../../constants/Colors";
import TextCatam from "../../components/TextCatamaran";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
export default class ComplianceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            loading: false,
            sales: 0,
            por_sales: 0,
            s_ppto_inter: 0,
            s_ppto_local: 0,
            s_ppto_patrim: 0,
            s_real_inter: 0,
            s_real_local: 0,
            s_real_patrim: 0,
            s_porc_inter: 0,
            s_porc_local: 0,
            s_porc_patrim: 0,
            s_tot_ppto: 0,
            s_tot_real: 0,
            s_tot_porc: 0,

            renovations: 0,
            r_ppto_inter: 0,
            r_ppto_local: 0,
            r_ppto_patrim: 0,
            r_real_inter: 0,
            r_real_local: 0,
            r_real_patrim: 0,
            r_porc_inter: 0,
            r_porc_local: 0,
            r_porc_patrim: 0,
            r_tot_ppto: 0,
            r_tot_real: 0,
            r_tot_porc: 0,
        }
    }

    componentDidMount() {
        this.getCompliance();
    }

    getCompliance = async () => {
        this.setState({ loading: true });

        try {
            const token = await AsyncStorage.getItem('_token');
            this.rsaApi.getCompliance(token).then(res => {
                if (!res.code) {
                    this.setState({
                        sales: res.sales.porcent,
                        s_ppto_inter: res.sales.ppto_amv_inter,
                        s_ppto_local: res.sales.ppto_amv_local,
                        s_ppto_patrim: res.sales.ppto_patrim,
                        s_real_inter: res.sales.real_amv_inter,
                        s_real_local: res.sales.real_amv_local,
                        s_real_patrim: res.sales.real_patrim,
                        s_porc_inter: res.sales.porc_amv_inter,
                        s_porc_local: res.sales.porc_amv_local,
                        s_porc_patrim: res.sales.porc_patrim,
                        s_tot_ppto: res.sales.total_ppto,
                        s_tot_real: res.sales.total_real,
                        s_tot_porc: res.sales.total_porc,

                        renovations: res.renovations.porcent,
                        r_ppto_inter: res.renovations.ppto_amv_inter,
                        r_ppto_local: res.renovations.ppto_amv_local,
                        r_ppto_patrim: res.renovations.ppto_patrim,
                        r_real_inter: res.renovations.real_amv_inter,
                        r_real_local: res.renovations.real_amv_local,
                        r_real_patrim: res.renovations.real_patrim,
                        r_porc_inter: res.renovations.porc_amv_inter,
                        r_porc_local: res.renovations.porc_amv_local,
                        r_porc_patrim: res.renovations.porc_patrim,
                        r_tot_ppto: res.renovations.total_ppto,
                        r_tot_real: res.renovations.total_real,
                        r_tot_porc: res.renovations.total_porc,
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

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <View style={styles.contentBar} />
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
                    style={styles.contentTitle}
                    onPress={() => this.props.navigation.goBack()}
                >
                    <View style={styles.btnBack}>
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.iconBack} />
                    </View>
                    <View style={styles.title}>
                        <TextCatam font='bold' others={styles.textTitle}>Cumplimiento Comercial</TextCatam>
                    </View>
                </TouchableOpacity>

                <ScrollView style={styles.contentContainer}>
                    <View style={styles.contentCumpl}>
                        <View style={styles.boxCumpl}>
                            <View style={styles.infoCumpl}>
                                <ProgressCircle
                                    percent={this.state.sales}
                                    radius={23}
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
                                    radius={23}
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

                    <View style={styles.contentTable}>
                        <View style={styles.col}>
                            <View style={styles.row}>
                                <View style={styles.colTit}>
                                    <TextCatam font='bold' others={styles.textTit}>VENTAS</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam font='bold' others={styles.textTit}>PPTO</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam font='bold' others={styles.textTit}>REAL</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam font='bold' others={styles.textTit}>CUMP</TextCatam>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.colTit}>
                                    <TextCatam font='bold' others={styles.textTit}>AMV Internacional</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.values}>{this.state.s_ppto_inter}</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.values}>{this.state.s_real_inter}</TextCatam>
                                </View>
                                <View style={[styles.colVal, { flexDirection: 'row' }]}>
                                    <TextCatam font='light' others={{ color: '#00863b', fontSize: 12 }}>{this.state.s_porc_inter}%</TextCatam>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.colTit}>
                                    <TextCatam font='bold' others={styles.textTit}>AMV Local</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.values}>{this.state.s_ppto_local}</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.values}>{this.state.s_real_local}</TextCatam>
                                </View>
                                <View style={[styles.colVal, { flexDirection: 'row' }]}>
                                    <TextCatam font='light' others={{ color: '#00863b', fontSize: 12 }}>{this.state.s_porc_local}%</TextCatam>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.colTit}>
                                    <TextCatam font='bold' others={styles.textTit}>Patrimoniales</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.values}>{this.state.s_ppto_patrim}</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.values}>{this.state.s_real_patrim}</TextCatam>
                                </View>
                                <View style={[styles.colVal, { flexDirection: 'row' }]}>
                                    <TextCatam font='light' others={{ color: '#00863b', fontSize: 12 }}>{this.state.s_porc_patrim}%</TextCatam>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.colTit}>
                                    <TextCatam font='bold' others={styles.textTit}>TOTAL</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.textTit}>{this.state.s_tot_ppto}</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.textTit}>{this.state.s_tot_real}</TextCatam>
                                </View>
                                <View style={[styles.colVal, { flexDirection: 'row' }]}>
                                    <TextCatam font='light' others={{ color: '#00863b', fontSize: 12 }}>{this.state.s_tot_porc}%</TextCatam>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.contentTable}>
                        <View style={styles.col}>
                            <View style={styles.row}>
                                <View style={styles.colTit}>
                                    <TextCatam font='bold' others={styles.textTit}>RENOVACIONES</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam font='bold' others={styles.textTit}>PPTO</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam font='bold' others={styles.textTit}>REAL</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam font='bold' others={styles.textTit}>CUMP</TextCatam>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.colTit}>
                                    <TextCatam font='bold' others={styles.textTit}>AMV Internacional</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.values}>{this.state.r_ppto_inter}</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.values}>{this.state.r_real_inter}</TextCatam>
                                </View>
                                <View style={[styles.colVal, { flexDirection: 'row' }]}>
                                    <TextCatam font='light' others={{ color: '#00863b', fontSize: 12 }}>{this.state.r_porc_inter}%</TextCatam>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.colTit}>
                                    <TextCatam font='bold' others={styles.textTit}>AMV Local</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.values}>{this.state.r_ppto_local}</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.values}>{this.state.r_real_local}</TextCatam>
                                </View>
                                <View style={[styles.colVal, { flexDirection: 'row' }]}>
                                    <TextCatam font='light' others={{ color: '#00863b', fontSize: 12 }}>{this.state.r_porc_local}%</TextCatam>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.colTit}>
                                    <TextCatam font='bold' others={styles.textTit}>Patrimoniales</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.values}>{this.state.r_ppto_patrim}</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.values}>{this.state.r_real_patrim}</TextCatam>
                                </View>
                                <View style={[styles.colVal, { flexDirection: 'row' }]}>
                                    <TextCatam font='light' others={{ color: '#00863b', fontSize: 12 }}>{this.state.r_porc_patrim}%</TextCatam>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.colTit}>
                                    <TextCatam font='bold' others={styles.textTit}>TOTAL</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.textTit}>{this.state.r_tot_ppto}</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam others={styles.textTit}>{this.state.r_tot_real}</TextCatam>
                                </View>
                                <View style={[styles.colVal, { flexDirection: 'row' }]}>
                                    <TextCatam font='light' others={{ color: '#00863b', fontSize: 12 }}>{this.state.r_tot_porc}%</TextCatam>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

ComplianceScreen.navigationOptions = {
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
    contentTitle: {
        height: 40,
        margin: 10,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnBack: {
        width: '10%',
    },
    iconBack: {
        fontSize: 25,
        color: '#00863b',
    },
    title: {
        width: '90%',
    },
    textTitle: {
        fontSize: 20,
        color: '#00863b',
    },
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
    verticalLineTall: {
        borderLeftWidth: 2,
        borderLeftColor: '#82bb27',
        height: 35,
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
    contentTable: {
        flex: 1,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
    },
    col: {
        flex: 1,
        flexDirection: 'column',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#00863b',
        height: 40,
    },
    colTit: {
        width: '40%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    colVal: {
        width: '20%',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#00863b',
        justifyContent: 'center',
    },
    values: {
        fontSize: 12,
    },
    textTit: {
        fontSize: 14,
        color: '#313e48',
    }
});
