import rsaApi from '../../api/rsa.js';
import React from 'react';
import { StyleSheet, Platform, StatusBar, Alert, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Components
import Colors from "../../constants/Colors";
import TextCatam from "../../components/TextCatamaran";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
export default class QuestionsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.rsaApi = new rsaApi();
        this.state = {
            loading: false,
            refreshing: true,
            page: 2,
            total: 0,
            questions: []
        }
    }

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('_token');
            if (value !== null) {
                return value;
            } else {
                AsyncStorage.removeItem('_token', () => {
                    this.props.navigation.navigate('Login');
                });
            }
        } catch (error) {
            console.log();
        }
    };

    async componentDidMount() {
        this.setState({ loading: true });
        try {
            const token = await this._retrieveData();
            this.rsaApi.getQuestions(token, `?page=1`).then(res => {
                if (!res.code) {
                    this.setState({
                        questions: res.questions,
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
        const questions = [...this.state.questions];

        try {
            const token = await this._retrieveData();
            const res = await this.rsaApi.getQuestions(token, `?page=${this.state.page}`);
            if (!res.code) {
                if (res.page <= res.lastPage && this.state.total === res.total) {
                    this.setState({
                        refreshing: true,
                        questions: questions.concat(res.questions),
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

    renderItem = (item) => {
        return (
            <View style={styles.contQuestion}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '8%' }}>
                        <FontAwesomeIcon icon={faQuestionCircle} name='question-circle' style={{ fontSize: 18, color: Colors.greenDark }}/>
                    </View>
                    <View style={{ width: '92%' }}>
                        <TextCatam others={{ fontSize: 14, color: Colors.greenDark }}>{item.question}</TextCatam>
                    </View>
                </View>
                <View style={styles.lineHrz} />
                <View>
                    <TextCatam>{item.description}</TextCatam>
                </View>
            </View>
        );
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

                <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={styles.contentTitle}
                >
                    <View style={styles.btnBack}>
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.iconBack} />
                    </View>
                    <View style={styles.title}>
                        <TextCatam font='bold' others={styles.textTitle}>Preguntas Frecuentes</TextCatam>
                    </View>
                </TouchableOpacity>

                <View style={styles.contentBody}>
                    <FlatList
                        data={this.state.questions}
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

QuestionsScreen.navigationOptions = {
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
    contQuestion: {
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
    },
    lineHrz: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: Colors.greenDark,
        marginTop: 3,
        marginBottom: 3,
    }
});