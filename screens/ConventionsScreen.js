import rsaApi from '../api/rsa.js';
import React from 'react';
import { StyleSheet, Platform, StatusBar, Alert, View, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Components
import Colors from "../constants/Colors";
import TextCatam from "../components/TextCatamaran";
import ContentConvention from "./partials/ContentConvention";
import ContentSlide from "./partials/ContentSlide";

export default class ConventionsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            loading: false,
            refreshing: true,
            page: 2,
            total: 0,
            conventions: []
        }
    }

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

    async componentDidMount() {
        this.setState({ loading: true });
        try {
            const token = await this._retrieveData();
            this.rsaApi.getConventions(token, `?page=1`).then(res => {
                if (!res.code) {
                    this.setState({
                        conventions: res.conventions,
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

    onEndReached = async () => {
        const conventions = [...this.state.conventions];

        try {
            const token = await this._retrieveData();
            const res = await this.rsaApi.getConventions(token, `?page=${this.state.page}`);
            if (!res.code) {
                if (res.page <= res.lastPage && this.state.total === res.total) {
                    this.setState({
                        refreshing: true,
                        conventions: conventions.concat(res.conventions),
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
        return (
            <View style={styles.container}>
                <View style={styles.contBar} />

                <View style={styles.contentTitle}>
                    <TextCatam font='ex-bold' others={{ color: Colors.greenDark, fontSize: 20 }}>Convenciones</TextCatam>
                </View>

                <View style={styles.contentSlider}>
                    <FlatList
                        data={this.state.conventions}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) =>
                            <ContentSlide item={item} />
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>

                <View style={styles.contentBody}>
                    <FlatList
                        data={this.state.conventions}
                        renderItem={({ item }) =>
                            <ContentConvention item={item} />
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

ConventionsScreen.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    contBar: {
        height: Platform.OS === 'ios' ? 55 : StatusBar.currentHeight,
        backgroundColor: Colors.greenDark,
    },
    contentTitle: {
        height: 50,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center',
    },
    contentSlider: {
        width: '100%',
        height: 180,
    },
    contentBody: {
        flex: 3,
        marginTop: 10,
    },
});