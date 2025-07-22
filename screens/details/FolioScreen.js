import rsaApi from '../../api/rsa.js';
import React from 'react';
import { Platform, StatusBar, TextInput, StyleSheet, FlatList, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Components
import Icon from "../../components/IconCustom";
import TextCatam from "../../components/TextCatamaran";
import Colors from '../../constants/Colors.js';

import ContentFolio from '../partials/ContentFolio.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
export default class FolioScreen extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            loading: false,
            refreshing: true,
            token: '',
            page: 2,
            total: 0,
            inputSearch: '',
            clients: [],
        }
        this.onEndReached = this.onEndReached.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    async getToken() {
        try {
            const val_token = await AsyncStorage.getItem('_token');
            if (val_token != null) {
                this.setState({ token: val_token });
            } else {
                AsyncStorage.removeItem('_token', () => {
                    this.props.navigation.navigate('Login');
                });
            }
        } catch (error) {
            console.log();
        }
    }

    async componentDidMount() {
        this.setState({ loading: true });
        await this.getToken();

        try {
            this.rsaApi.getFolio(this.state.token, '?page=1').then(res => {
                if (!res.code) {
                    this.setState({
                        clients: res.clients,
                        total: res.total,
                        loading: false,
                        refreshing: res.total === 0 ? false : this.state.refreshing,
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
    }

    searching = (text) => { this.setState({ inputSearch: text }); }

    onSearch = async () => {
        try {
            const res = await this.rsaApi.getFolio(this.state.token, `?search=${this.state.inputSearch}`);
            if (!res.code) {
                if (res.page <= res.lastPage) {
                    this.setState({
                        clients: res.clients,
                        total: res.total,
                        refreshing: res.total === 0 ? false : this.state.refreshing,
                    });
                }
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
        } catch (err) {
            Alert.alert('Error', err.message, [{ text: 'Cerrar' }]);
        };
    }

    onEndReached = async () => {
        const clients = [...this.state.clients];

        try {
            const res = await this.rsaApi.getFolio(this.state.token, `?page=${this.state.page}`);
            if (!res.code) {
                if (res.page <= res.lastPage && this.state.total === res.total) {
                    this.setState({
                        refreshing: true,
                        clients: clients.concat(res.clients),
                        total: res.total,
                        page: this.state.page + 1,
                    });
                } else {
                    this.setState({ refreshing: false });
                }
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
        } catch (err) {
            Alert.alert('Error', err.message, [{ text: 'Cerrar' }]);
        };
    }

    renderListFoot = () => {
        if (this.state.refreshing) {
            return (
                <View>
                    <ActivityIndicator size="small" color={Colors.greenLight} />
                </View>
            );
        }
        return (<View />);
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
            <View style={styles.container} contentContainerStyle={{ flex: 1 }}>
                <View style={styles.contentBar} />

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Home')}
                    style={styles.contentTitle}
                >
                    <View style={styles.btnBack}>
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.iconBack} />
                    </View>
                    <View style={styles.title}>
                        <TextCatam font='bold' others={styles.textTitle}>Clientes</TextCatam>
                    </View>
                </TouchableOpacity>

                <View style={styles.contentSearch}>
                    <View style={{ width: "90%" }}>
                        <TextInput
                            onChangeText={(text) => this.searching(text)}
                            style={styles.inputSearch}
                            placeholder="Buscar.."
                        />
                    </View>
                    <TouchableOpacity
                        onPress={this.onSearch}
                        style={{ width: "10%", alignItems: 'center' }}
                    >
                        <Icon name="search" styles={styles.iconSearch} />
                    </TouchableOpacity>
                </View>

                <View style={styles.contentBody}>
                    <FlatList
                        data={this.state.clients}
                        renderItem={({ item }) =>
                            <ContentFolio
                                item={item}
                                navigate={this.props.navigation.navigate}
                            />
                        }
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={this.onEndReached}
                        ListFooterComponent={() => this.renderListFoot()}
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

FolioScreen.navigationOptions = {
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
        height: 40,
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentSearch: {
        height: 30,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentBody: {
        flex: 1,
    },
    inputSearch: {
        borderWidth: 1,
        borderColor: Colors.greenDark,
        borderRadius: 3,
        padding: 3,
    },
    iconSearch: {
        fontSize: 22,
        color: Colors.greenLight,
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
});
