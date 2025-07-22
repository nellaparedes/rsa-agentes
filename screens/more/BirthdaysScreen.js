import rsaApi from '../../api/rsa.js';
import React from 'react';
import { ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, StatusBar } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

//Components
import Colors from "../../constants/Colors";
import TextCatam from "../../components/TextCatamaran";
import { faArrowLeft, faBirthdayCake, faMailBulk, faPhone } from '@fortawesome/free-solid-svg-icons';

export default class BirthdaysScreen extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            loading: false,
            token: '',
            clients: [],
        }
    }

    async getToken() {
        try {
            const val_token = await AsyncStorage.getItem('_token');
            if(val_token != null) {
                this.setState({ token: val_token });
            } else {
                AsyncStorage.removeItem('_token', () => {
                    this.props.navigation.navigate('Login');
                });
            }
        } catch(error) {
            console.log();
        }
    }

    async componentDidMount() {
        this.setState({ loading: true });
        await this.getToken();

        try {
            this.rsaApi.getBirthdays(this.state.token).then(res => {
                if(!res.code) {
                    this.setState({
                        clients: res,
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
                            if(index === 0){ msg = itemData; } else { msg = msg + ' \n'+itemData; }
                        });
                        if(res.validations){ Alert.alert( 'Error', msg, [{ text: 'Cerrar' }] ); }
                    }
                }
            });
        } catch (err) {
            Alert.alert('Error', err.message, [{ text: 'Cerrar' }]);
        };
    }

    renderItem = (item) => {
        let cell;
        let phone;
        let email;

        if(item.cell && item.cell !== '0') {
            cell = (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faPhone} name="md-call" style={{fontSize: 15, color: Colors.greenLight, marginRight: 5}}/>
                    <TextCatam>{item.cell}</TextCatam>
                </View>
            );
        }
        if(item.phone && item.phone !== '0') {
            phone = (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faPhone} name="md-call" style={{fontSize: 15, color: Colors.greenLight, marginRight: 5}}/>
                    <TextCatam>{item.phone}</TextCatam>
                </View>
            );
        }
        if(item.email) {
            email = (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faMailBulk} name="md-mail" style={{fontSize: 15, color: Colors.greenLight, marginRight: 5}}/>
                    <TextCatam>{item.email}</TextCatam>
                </View>
            );
        }

        return (
            <View style={styles.contBirthday}>
                <View style={{width: 75, justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faBirthdayCake} name='birthday-cake' style={{fontSize: 40, color: Colors.greenDark}}/>
                    <TextCatam>{item.birthday}</TextCatam>
                </View>
                <View style={{flex: 1, paddingLeft: 10}}>
                    <TextCatam>{item.client}</TextCatam>
                    {cell}
                    {phone}
                    {email}
                </View>
            </View>
        );
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <View style={styles.contentBar}/>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={Colors.greenLight}/>
                    </View>
                </View>
            );
        };

        return (
            <View style={styles.container}>

                <View style={styles.contentBar}/>

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('More')}
                    style={styles.contentTitle}
                >
                    <View style={styles.btnBack}>
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.iconBack} />
                    </View>
                    <View style={styles.title}>
                        <TextCatam font='bold' others={styles.textTitle}>Cumpleaños</TextCatam>
                    </View>
                </TouchableOpacity>

                <View style={styles.contentBody}>
                    <FlatList
                        data={this.state.clients}
                        renderItem={({ item }) => this.renderItem(item)}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={
                            <View style={{ margin: 10, alignItems: 'center' }}>
                                <TextCatam>No hay registros</TextCatam>
                            </View>
                        }
                    />
                </View>

            </View>
        );
    }
}

BirthdaysScreen.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentBar: {
        height: Platform.OS === 'ios' ? 55 : StatusBar.currentHeight,
        backgroundColor: Colors.greenDark,
    },
    contentTitle: {
        height: 50,
        margin: 10,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentBody: {
        flex: 1,
    },
    btnBack: {
        width: '10%',
    },
    iconBack: {
        fontSize: 25,
        color: Colors.greenDark,
    },
    title: {
        width: '90%',
    },
    textTitle: {
        fontSize: 20,
        color: Colors.greenDark,
    },
    contBirthday: {
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: Colors.grey,
        elevation: 4,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: "grey",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 5,
        padding: 10,
        flexDirection: 'row',
    }
});