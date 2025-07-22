import rsaApi from '../api/rsa.js';
import React from 'react';
import { Platform, StatusBar, ActivityIndicator, StyleSheet, TextInput, FlatList, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Components
import Icon from "../components/IconCustom";
import Colors from "../constants/Colors";
import TextCatam from "../components/TextCatamaran";
import ContentPolicy from "./partials/ContentPolicy";

export default class PoliciesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            loading: false,
            refreshing: true,
            token: '',
            page: 2,
            total: 0,
            tab: 'actived',
            data: [],
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
                this.props.navigation.navigate('Login');
            }
        } catch (error) {
            console.log();
        }
    }

    async componentDidMount() {
        await this.getToken();
        await this.getPolicies('actived');
    }

    async getPolicies(tab) {
        this.setState({
            loading: true,
            tab: tab,
            page: this.state.page != tab ? 2 : this.state.page,
        });

        try {
            this.rsaApi.getPolicies(this.state.token, tab).then(res => {
                if (!res.code) {
                    this.setState({
                        data: res.policies,
                        total: res.total,
                        loading: false,
                        refreshing: res.total === 0 ? false : this.state.refreshing,
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

    searching = (text) => { this.setState({ inputSearch: text }); }

    async onSearch() {
        try {
            const res = await this.rsaApi.getPolicies(this.state.token, `${this.state.tab}?search=${this.state.inputSearch}`);
            if (!res.code) {
                if (res.page <= res.lastPage) {
                    this.setState({
                        data: res.policies,
                        total: res.total,
                        refreshing: res.total === 0 ? false : this.state.refreshing,
                    });
                }
            } else {
                if (res.code === 401 || res.code === 400) {
                    this.props.navigation.navigate('Login');
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

    async onEndReached() {
        const data = [...this.state.data];

        try {
            const res = await this.rsaApi.getPolicies(this.state.token, `${this.state.tab}?page=${this.state.page}`);
            if (!res.code) {
                if (res.page <= res.lastPage && this.state.total === res.total) {
                    this.setState({
                        refreshing: true,
                        data: data.concat(res.policies),
                        total: res.total,
                        page: this.state.page + 1,
                    });
                } else {
                    this.setState({ refreshing: false });
                }
            } else {
                if (res.code === 401 || res.code === 400) {
                    this.props.navigation.navigate('Login');
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

    getTabMenuStyle(tab) {
        if (this.state.tab === tab) {
            return {
                container: styles.tabSelect,
                text: styles.tabTextSelect,
            }
        }
        return {
            container: styles.tabOption,
            text: styles.tabTextOption,
        }
    }

    renderTabMenu() {
        const array = {
            'actived': 'ACTIVAS',
            'byexpired': 'POR VENCER',
            'expired': 'VENCIDAS',
        };

        const menu = [];
        let menuStyle;

        for (const tab of Object.keys(array)) {
            menuStyle = this.getTabMenuStyle(tab);
            menu.push(
                <TouchableOpacity
                    onPress={() => this.getPolicies(tab)}
                    style={menuStyle.container}
                    key={tab}
                >
                    <TextCatam font='bold' others={menuStyle.text}>{array[tab]}</TextCatam>
                </TouchableOpacity>
            );
        }

        return menu;
    }

    renderItem = (item) => {
        return (
            <ContentPolicy
                policy={item.poliza}
                insurer={item.aseguradora}
                client={item.cliente}
                status={item.estado}
                branch={item.ramo}
                plan={item.producto}
                dependents={item.cantDep}
                validity={item.vigDesde}
                renew={item.vigHasta}
                frequency={item.formaPago}
                deal={item.negocio}
                deductible={item.deducible}
                primenet={item.primaNeta}
                ejecutive={item.ejecutivo}
            />
        );
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
            <View style={styles.container}>

                <View style={styles.contentBar} />

                <View style={styles.contentTitle}>
                    <View style={styles.title}>
                        <TextCatam font='ex-bold' others={styles.textTitle}>Pólizas</TextCatam>
                    </View>
                </View>

                <View style={styles.contentNav}>
                    {this.renderTabMenu()}
                </View>

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
                        data={this.state.data}
                        renderItem={({ item }) => this.renderItem(item)}
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

PoliciesScreen.navigationOptions = {
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
        margin: 10,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentNav: {
        height: 30,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: Colors.greyDark,
    },
    contentSearch: {
        height: 30,
        marginLeft: 15,
        marginRight: 15,
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
    tabSelect: {
        flex: 1,
        backgroundColor: Colors.greyDark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabOption: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 3,
        paddingBottom: 3,
    },
    tabTextSelect: {
        fontSize: 12,
        color: Colors.greenDark,
    },
    tabTextOption: {
        fontSize: 12,
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
});