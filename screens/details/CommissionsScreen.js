import rsaApi from '../../api/rsa.js';
import React from 'react';
import { ScrollView, StyleSheet, Platform, StatusBar, TouchableOpacity, FlatList, View, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Components
import Icon from "../../components/IconCustom";
import Colors from "../../constants/Colors";
import TextCatam from "../../components/TextCatamaran";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default class CommissionsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            loading: false,
            date: '',
            pay: 0,
            receiv: 0,
            byliq: 0,
            pendings: [],
            liquidates: [],
        }
    }

    componentDidMount() {
        this.getCommissions();
    }

    getCommissions = async () => {
        this.setState({ loading: true });

        try {
            const token = await AsyncStorage.getItem('_token');
            this.rsaApi.getCommissions(token).then(res => {
                if (!res.code) {
                    this.setState({
                        date: res.date,
                        pay: res.pay,
                        receiv: res.receivable,
                        byliq: res.byliquidate,
                        pendings: res.pendings,
                        liquidates: res.liquidates,
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
                <ScrollView style={styles.contentContainer} nestedScrollEnabled={true}>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Home')}
                        style={styles.contentTitle}
                    >
                        <View style={styles.btnBack}>
                            <FontAwesomeIcon icon={faArrowLeft} style={styles.iconBack} />
                        </View>
                        <View style={styles.title}>
                            <TextCatam font='bold' others={styles.textTitle}>Comisiones</TextCatam>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.contentComms}>
                        <View>
                            <TextCatam>{this.state.date}</TextCatam>
                        </View>
                        <View style={styles.boxComms}>
                            <View style={styles.infoComms}>
                                <TextCatam font='bold' others={styles.valueComms}>$ {this.state.pay}</TextCatam>
                                <TextCatam font='bold' others={styles.textPaid}>PAGADAS</TextCatam>
                            </View>
                            <View style={styles.verticalLineTall}></View>
                            <View style={styles.infoComms}>
                                <TextCatam font='bold' others={styles.valueComms}>$ {this.state.receiv}</TextCatam>
                                <TextCatam font='bold' others={styles.textReceivable}>POR COBRAR</TextCatam>
                            </View>
                        </View>
                        <View style={styles.lineHrz} />
                        <View style={styles.footByLiq}>
                            <TextCatam>POR LIQUIDAR: $ {this.state.byliq}</TextCatam>
                        </View>
                    </View>

                    <View style={styles.commsClient}>
                        <View style={styles.col}>
                            <View style={styles.row}>
                                <TextCatam font='bold' others={styles.titleComsCli}>Comisión por Cobrar</TextCatam>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.colCli}>
                                    <TextCatam font='bold' others={styles.textTit}>Cliente</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam font='bold' others={styles.textTit}>Prima</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam font='bold' others={styles.textTit}>Comisión</TextCatam>
                                </View>
                            </View>
                            <FlatList
                                nestedScrollEnabled={true}
                                style={{ height: 200 }}
                                data={this.state.pendings}
                                renderItem={({ item }) =>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Contract', { client: item.cod_cli, name: item.client })}
                                        style={styles.row}
                                    >
                                        <View style={styles.colCli}>
                                            <Icon name='cliente-comision' styles={styles.iconCli} />
                                            <TextCatam others={{ fontSize: 9 }}>{item.client}</TextCatam>
                                        </View>
                                        <View style={styles.colVal}>
                                            <TextCatam font='bold' others={{ fontSize: 10 }}>$ {item.prima}</TextCatam>
                                        </View>
                                        <View style={styles.colVal}>
                                            <TextCatam font='bold' others={{ fontSize: 10 }}>$ {item.comision}</TextCatam>
                                        </View>
                                    </TouchableOpacity>
                                }
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>

                    <View style={styles.commsClient}>
                        <View style={styles.col}>
                            <View style={styles.row}>
                                <TextCatam font='bold' others={styles.titleComsCli}>Comisión por Liquidar</TextCatam>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.colCli}>
                                    <TextCatam font='bold' others={styles.textTit}>Cliente</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam font='bold' others={styles.textTit}>Prima</TextCatam>
                                </View>
                                <View style={styles.colVal}>
                                    <TextCatam font='bold' others={styles.textTit}>Comisión</TextCatam>
                                </View>
                            </View>
                            <FlatList
                                nestedScrollEnabled={true}
                                style={{ height: 200 }}
                                data={this.state.liquidates}
                                renderItem={({ item }) =>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Contract', { client: item.cod_cli, name: item.client })}
                                        style={styles.row}
                                    >
                                        <View style={styles.colCli}>
                                            <Icon name='cliente-comision' styles={styles.iconCli} />
                                            <TextCatam others={{ fontSize: 9 }}>{item.client}</TextCatam>
                                        </View>
                                        <View style={styles.colVal}>
                                            <TextCatam font='bold' others={{ fontSize: 10 }}>$ {item.prima}</TextCatam>
                                        </View>
                                        <View style={styles.colVal}>
                                            <TextCatam font='bold' others={{ fontSize: 10 }}>$ {item.comision}</TextCatam>
                                        </View>
                                    </TouchableOpacity>
                                }
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>

                </ScrollView>
            </View>
        );
    }
}

CommissionsScreen.navigationOptions = {
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
        flex: 1,
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
    verticalLineTall: {
        borderLeftWidth: 2,
        borderLeftColor: '#82bb27',
        height: 35,
    },
    textPaid: {
        color: '#00863b',
        fontSize: 10,
    },
    textReceivable: {
        color: '#82bb27',
        fontSize: 10,
    },
    footByLiq: {
        alignItems: 'flex-end',
    },
    commsClient: {
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        padding: 15,
    },
    col: {
        flex: 1,
        flexDirection: 'column',
    },
    row: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    titleComsCli: {
        fontSize: 18,
        color: '#00863b',
    },
    colCli: {
        width: '40%',
        flexDirection: 'row',
        alignSelf: 'center',
    },
    colVal: {
        width: '30%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    iconCli: {
        fontSize: 18,
        color: '#00863b',
        alignSelf: 'center',
        marginRight: 5,
    },
    lineHrz: {
        width: '100%',
        borderBottomWidth: 1,
        marginTop: 3,
        marginBottom: 3,
    }
});
