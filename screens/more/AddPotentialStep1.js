import rsaApi from '../../api/rsa.js';
import React from 'react';
import { ScrollView, Platform, StatusBar, StyleSheet, TextInput, Alert, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from 'react-native-masked-text'
import RNPickerSelect from 'react-native-picker-select';
import DateField from '../../components/DateField';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

//Components
import Colors from "../../constants/Colors";
import TextCatam from "../../components/TextCatamaran";
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default class AddPotentialStep1 extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            loading: false,
            type_clients: [],
            type_client: 0,
            cities: [],
            city: 0,
            client: '',
            branches: [],
            branch: 0,
            insurers_ofer: [],
            insurer_ofer: 0,
            channels: [],
            channel: 0,
            prime: '',
            pay_frecuency: [],
            frecuency: 0,
            proy_comi_month: 0,
            proy_comi_year: 0,
            date_ofert: '',
            broker: '',
            date_vcto_seg: '',
            insurer: '',
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

    async componentDidMount() {
        this.setState({ loading: true });
        const token = await this.getToken();

        try {
            this.rsaApi.getCreationPotential(token).then(res => {
                if (!res.code) {
                    this.setState({
                        type_clients: res.type_clients,
                        branches: res.branches,
                        channels: res.channels,
                        cities: res.cities,
                        pay_frecuency: res.pay_frecuency,
                        insurers_ofer: res.insurers_ofer,
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
    }

    validateInput = () => {
        const pickers = {
            'type_client': 'Tipo de Cliente',
            'city': 'Ciudad',
            'branch': 'Ramo',
            'insurer_ofer': 'Asegur. Ofertante',
            'channel': 'Canal',
            'frecuency': 'Frecuencia de Pago',
            'proy_comi_month': 'mes de Proy. Comi.',
            'proy_comi_year': 'año de Proy. Comi.',
            'date_ofert': 'Fecha de Oferta',
        };

        for (const index of Object.keys(pickers)) {
            if (this.state[index] === 0) {
                Alert.alert('Alerta', 'El campo ' + pickers[index] + ' es requerido', [{ text: 'Cerrar' }]);
                return false;
            }
        }

        const inputs = {
            'client': 'Cliente',
            'prime': 'Prima Neta Anual',
            'date_ofert': 'Fecha Oferta',
            'date_ofert': 'Fecha Oferta',
        };

        for (const index of Object.keys(inputs)) {
            if (this.state[index].trim() === "") {
                Alert.alert('Alerta', 'El campo ' + inputs[index] + ' es requerido', [{ text: 'Cerrar' }]);
                return false;
            }
        }

        if (this.state.proy_comi_month < 1 || this.state.proy_comi_month > 12) {
            Alert.alert('Alerta', 'El campo mes de Proy. Comi. es incorrecto', [{ text: 'Cerrar' }]);
            return false;
        }

        if (this.state.proy_comi_year < 2000 || this.state.proy_comi_year > 3000) {
            Alert.alert('Alerta', 'El campo año de Proy. Comi. es incorrecto', [{ text: 'Cerrar' }]);
            return false;
        }

        return true;
    }

    toContacts = async () => {
        const validations = await this.validateInput();

        if (validations) {
            const { type_client, city, client, branch, insurer_ofer, channel, prime, frecuency, proy_comi_month, proy_comi_year, date_ofert, broker, date_vcto_seg, insurer } = this.state;
            const date_proy_comi = `${proy_comi_month}/${proy_comi_year}`;

            var params = {
                TIPO_CLIENTE: type_client,
                CIU_CODIGO: city,
                POT_CLIENTE: client,
                RAMO_CODIGO: branch,
                ASE_CODIGO: insurer_ofer,
                CAN_CODIGO: channel,
                PRIMA_NETA: prime,
                FP_CODIGO: frecuency,
                POT_FCH_PROY_PROD: date_proy_comi,
                POT_FCH_OFERTA: date_ofert,
                AGE_ACTUAL: broker,
                POT_FCH_VCTO: date_vcto_seg,
                ASE_ACTUAL: insurer,
            };

            this.props.navigation.navigate('AddStep2', { potential: params });
        }
    }

    toCancel = () => {
        this.setState(this.baseState);
        this.props.navigation.navigate('Potentials');
    }

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
                    <TextCatam font='bold'>INFORMACIÓN PRINCIPAL</TextCatam>
                </View>

                <View style={styles.contForm}>
                    <ScrollView>
                        <View style={styles.row}>
                            <View style={styles.colLeft}>
                                <TextCatam others={styles.label}>Tipo de Cliente *</TextCatam>
                                <RNPickerSelect
                                    placeholder={placeholderInput}
                                    useNativeAndroidPickerStyle={false}
                                    onValueChange={val => this.onChangeText('type_client', val)}
                                    items={this.state.type_clients}
                                    style={pickerStyles}
                                    doneText='OK'
                                    Icon={() => { return <FontAwesomeIcon icon={faChevronDown} name="chevron-down" size={18} />; }}
                                />
                            </View>
                            <View style={styles.colRight}>
                                <TextCatam others={styles.label}>Ciudad *</TextCatam>
                                <RNPickerSelect
                                    placeholder={placeholderInput}
                                    useNativeAndroidPickerStyle={false}
                                    onValueChange={val => this.onChangeText('city', val)}
                                    items={this.state.cities}
                                    style={pickerStyles}
                                    doneText='OK'
                                    Icon={() => { return <FontAwesomeIcon icon={faChevronDown} name="chevron-down" size={18} />; }}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1, marginBottom: 10 }}>
                            <TextCatam others={styles.label}>Cliente *</TextCatam>
                            <TextInput
                                placeholder={'Nombre o razón social'}
                                autoCapitalize='characters'
                                onChangeText={val => this.onChangeText('client', val)}
                                style={styles.inputText}
                            />
                        </View>
                        <View style={{ flex: 1, marginBottom: 10 }}>
                            <TextCatam others={styles.label}>Ramo *</TextCatam>
                            <RNPickerSelect
                                placeholder={placeholderInput}
                                useNativeAndroidPickerStyle={false}
                                onValueChange={val => this.onChangeText('branch', val)}
                                items={this.state.branches}
                                style={pickerStyles}
                                doneText='OK'
                                Icon={() => { return <FontAwesomeIcon icon={faChevronDown} name="chevron-down" size={18} />; }}
                            />
                        </View>
                        <View style={styles.row}>
                            <View style={styles.colLeft}>
                                <TextCatam others={styles.label}>Asegur. Ofertante *</TextCatam>
                                <RNPickerSelect
                                    placeholder={placeholderInput}
                                    useNativeAndroidPickerStyle={false}
                                    onValueChange={val => this.onChangeText('insurer_ofer', val)}
                                    items={this.state.insurers_ofer}
                                    style={pickerStyles}
                                    doneText='OK'
                                    Icon={() => { return <FontAwesomeIcon icon={faChevronDown} name="chevron-down" size={18} />; }}
                                />
                            </View>
                            <View style={styles.colRight}>
                                <TextCatam others={styles.label}>Canal *</TextCatam>
                                <RNPickerSelect
                                    placeholder={placeholderInput}
                                    useNativeAndroidPickerStyle={false}
                                    onValueChange={val => this.onChangeText('channel', val)}
                                    items={this.state.channels}
                                    style={pickerStyles}
                                    doneText='OK'
                                    Icon={() => { return <FontAwesomeIcon icon={faChevronDown} name="chevron-down" size={18} />; }}
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.colLeft}>
                                <TextCatam others={styles.label}>Prima Neta Anual *</TextCatam>
                                <TextInputMask
                                    type={'money'}
                                    placeholder={'0.00'}
                                    options={{ precision: 2, separator: '.', delimiter: ',', unit: '' }}
                                    value={this.state.prime}
                                    onChangeText={val => this.onChangeText('prime', val)}
                                    style={styles.inputText}
                                />
                            </View>
                            <View style={styles.colRight}>
                                <TextCatam others={styles.label}>Frecuencia de Pago *</TextCatam>
                                <RNPickerSelect
                                    placeholder={placeholderInput}
                                    useNativeAndroidPickerStyle={false}
                                    onValueChange={val => this.onChangeText('frecuency', val)}
                                    items={this.state.pay_frecuency}
                                    style={pickerStyles}
                                    doneText='OK'
                                    Icon={() => { return <FontAwesomeIcon icon={faChevronDown} name="chevron-down" size={18} />; }}
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.colLeft}>
                                <TextCatam others={styles.label}>Mes/Año Proy. Comi. *</TextCatam>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '45%' }}>
                                        <TextInput
                                            placeholder='mes'
                                            keyboardType='numeric'
                                            maxLength={2}
                                            onChangeText={val => this.onChangeText('proy_comi_month', val)}
                                            style={styles.inputText}
                                        />
                                    </View>
                                    <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                                        <TextCatam others={{ fontSize: 20 }}>/</TextCatam>
                                    </View>
                                    <View style={{ width: '45%' }}>
                                        <TextInput
                                            placeholder='año'
                                            keyboardType='numeric'
                                            maxLength={4}
                                            onChangeText={val => this.onChangeText('proy_comi_year', val)}
                                            style={styles.inputText}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.colRight}>
                                <TextCatam others={styles.label}>Fecha Oferta *</TextCatam>
                                <DateField
                                    style={styles.inputDate}
                                    value={this.state.date_ofert}
                                    placeholder="dd-mm-aaaa"
                                    textStyle={styles.inputDateText}
                                    onChange={val => this.onChangeText('date_ofert', val)}
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.colLeft}>
                                <TextCatam others={styles.label}>Boker Actual</TextCatam>
                                <TextInput
                                    autoCapitalize='characters'
                                    onChangeText={val => this.onChangeText('broker', val)}
                                    style={styles.inputText}
                                />
                            </View>
                            <View style={styles.colRight}>
                                <TextCatam others={styles.label}>Fecha Vcto. Seg. Actual</TextCatam>
                                <DateField
                                    style={styles.inputDate}
                                    value={this.state.date_vcto_seg}
                                    placeholder="dd-mm-aaaa"
                                    textStyle={styles.inputDateText}
                                    onChange={val => this.onChangeText('date_vcto_seg', val)}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1, marginBottom: 10 }}>
                            <TextCatam others={styles.label}>Aseguradora Actual</TextCatam>
                            <TextInput
                                autoCapitalize='characters'
                                onChangeText={val => this.onChangeText('insurer', val)}
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
                                onPress={this.toContacts}
                                style={styles.btnNext}
                            >
                                <TextCatam font='bold' others={{ color: '#ffff' }}>Siguiente</TextCatam>
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
    row: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
    },
    colLeft: {
        flex: 1,
        marginRight: 10,
    },
    colRight: {
        flex: 1,
        marginLeft: 10,
    },
    label: {
        fontSize: 12,
    },
    inputText: {
        height: Platform.OS == 'ios' ? 38 : 30,
        fontFamily: 'catamaran',
        fontSize: 13,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greenLight,
    },
    inputPicker: {
        width: '100%',
        height: '59%',
    },
    inputDate: {
        height: Platform.OS == 'ios' ? 36 : 28,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        paddingBottom: 4,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greenLight,
    },
    inputDateText: {
        fontFamily: 'catamaran',
        fontSize: 13,
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
    },
});

const pickerStyles = StyleSheet.create({
    inputIOS: {
        height: 38,
        fontFamily: 'catamaran',
        fontSize: 13,
        color: 'black',
        paddingVertical: 12,
        paddingHorizontal: 5,
        paddingRight: 30,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greenLight,
    },
    inputAndroid: {
        height: 30,
        fontFamily: 'catamaran',
        fontSize: 13,
        paddingVertical: 5,
        paddingHorizontal: 5,
        paddingRight: 30,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greenLight,
    },
    iconContainer: {
        top: 5,
        right: 5,
    },
});

const placeholderInput = {
    label: 'Seleccione..',
    value: null,
    color: '#9EA0A4',
};