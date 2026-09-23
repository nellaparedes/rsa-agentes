import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, Linking, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import call from 'react-native-phone-call';

//Components
import TextCatam from "../../components/TextCatamaran";
import Colors from '../../constants/Colors.js';
import { faArrowLeft, faMailBulk, faPhone } from '@fortawesome/free-solid-svg-icons';

export default class ContentFolio extends React.Component {
    toCall(num) {
        const args = { number: num, prompt: false };
        call(args).catch(console.error)
    }

    render() {
        const { item } = this.props;

        let cell;
        let email;

        if(item.cell) {
            cell = (
                <TouchableOpacity
                    onPress={() => this.toCall(item.cell)}
                    style={styles.textContact}
                >
                    <FontAwesomeIcon icon={faPhone} name="md-call" />
                    <TextCatam others={{ fontSize: 13, marginLeft: 3 }}>{item.cell}</TextCatam>
                </TouchableOpacity>
            );
        }
        if(item.email) {
            email = (
                <TouchableOpacity
                    onPress={() => Linking.openURL('mailto:'+item.email) }
                    style={styles.textContact}
                >
                    <FontAwesomeIcon icon={faMailBulk} name="md-mail" />
                    <TextCatam others={{ fontSize: 13, marginLeft: 3 }}>{item.email}</TextCatam>
                </TouchableOpacity>
            );
        }


        return (
            <View style={styles.contentFolio}>
                <TouchableOpacity
                    style={styles.contHead}
                    onPress={() => this.props.navigate('Contract', { client: item.cod_cli, name: item.name })}
                >
                    <View style={styles.contName}>
                        <View style={styles.iconLetter}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.letter}</Text>
                        </View>
                        <View><TextCatam font="bold" others={{ fontSize: 12 }}>{item.name}</TextCatam></View>
                    </View>
                    <View style={styles.contArrow}>
                        <FontAwesomeIcon icon={faArrowLeft} style={styles.arrow} name="ios-arrow-forward" />
                    </View>
                </TouchableOpacity>
                <View style={styles.contBody}>
                    
                    <View style={styles.contContacts}>
                        {cell}
                        {email}
                    </View>
                    <View style={styles.contPolicies}>
                        <View style={[styles.row, styles.borderBottom]}>
                            <View style={styles.colTitle}>
                                <TextCatam others={{ fontSize: 12 }}>Pólizas</TextCatam>
                            </View>
                            <View style={styles.col}>
                                <View style={styles.cols}>
                                    <Image
                                        source={require('../../assets/images/amv_internacional.png')}
                                        style={styles.imgFolio}
                                    />
                                    <TextCatam font='bold' others={{ color: '#00863b' }}>{item.num_inter}</TextCatam>
                                </View>
                            </View>
                            <View style={styles.col}>
                                <View style={styles.cols}>
                                    <Image
                                        source={require('../../assets/images/amv_local.png')}
                                        style={styles.imgFolio}
                                    />
                                    <TextCatam font='bold' others={{ color: '#00863b' }}>{item.num_local}</TextCatam>
                                </View>
                            </View>
                            <View style={[styles.col, styles.borderRight]}>
                                <View style={styles.cols}>
                                    <Image
                                        source={require('../../assets/images/patrimonial.png')}
                                        style={styles.imgFolio}
                                    />
                                    <TextCatam font='bold' others={{ color: '#00863b' }}>{item.num_patri}</TextCatam>
                                </View>
                            </View>
                            <View style={styles.col}>
                                <View style={styles.cols}>
                                    <View style={styles.circleTotal}>
                                        <TextCatam font='light' others={{ fontSize: 6 }}>TOTAL</TextCatam>
                                    </View>
                                    <TextCatam font='bold' others={{ color: '#00863b' }}>{item.num_total}</TextCatam>
                                </View>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.colTitle}>
                                <TextCatam others={{ fontSize: 12 }}>Prima:</TextCatam>
                            </View>
                            <View style={styles.col}>
                                <View style={styles.cols}>
                                    <TextCatam font='bold' others={{ fontSize: 10 }}>$ {item.prim_inter}</TextCatam>
                                </View>
                            </View>
                            <View style={styles.col}>
                                <View style={styles.cols}>
                                    <TextCatam font='bold' others={{ fontSize: 10 }}>$ {item.prim_local}</TextCatam>
                                </View>
                            </View>
                            <View style={[styles.col, styles.borderRight]}>
                                <View style={styles.cols}>
                                    <TextCatam font='bold' others={{ fontSize: 10 }}>$ {item.prim_patri}</TextCatam>
                                </View>
                            </View>
                            <View style={styles.col}>
                                <View style={styles.cols}>
                                    <TextCatam font='bold' others={{ fontSize: 10 }}>$ {item.prim_total}</TextCatam>
                                </View>
                            </View>
                        </View>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contentFolio: {
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
    },
    contHead: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contName: {
        width: "95%",
        alignItems: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    contArrow: {
        width: "5%",
        alignItems: 'flex-end',
    },
    iconLetter: {
        width: 18,
        height: 18,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00863b',
        marginRight: 5,
    },
    arrow: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00863b',
    },
    contBody: {
        marginLeft: 25,
        marginRight: 10,
    },
    contContacts: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    textContact: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contPolicies: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    row: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    colTitle: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'flex-end',
    },
    col: {
        flex: 1,
        alignSelf: 'stretch',
    },
    cols: {
        alignItems: 'center'
    },
    imgFolio: {
        width: 30,
        height: 30,
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: '#00863b',
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#00863b',
    },
    circleTotal: {
        width: '20%',
        borderWidth: 4,
        borderColor: '#9fae84',
        width: 30,
        height: 30,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
});