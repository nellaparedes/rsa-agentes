import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

//Components
import TextCatam from "../../components/TextCatamaran";
import Colors from '../../constants/Colors.js';

export default class ContentPotential extends React.Component {
    render() {
        const { item } = this.props;
        return (
            <View style={styles.contentPotential}>
                <View style={styles.contHead}>
                    <View style={styles.headIconLeft}>
                        <View style={styles.iconLetter}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.letter}</Text>
                        </View>
                    </View>
                    <View style={styles.headPolicy}>
                        <TextCatam font="bold" others={{ fontSize: 12 }}>{item.client}</TextCatam>
                    </View>
                </View>
                <View style={styles.contBody}>
                    <View style={styles.bodyCol}>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Ramo</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{item.branch}</TextCatam>
                        </View>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Tipo de Cliente</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{item.type}</TextCatam>
                        </View>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Frecuencia de Pago</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{item.pay}</TextCatam>
                        </View>
                    </View>
                    <View style={styles.bodyCol}>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Ciudad</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{item.city}</TextCatam>
                        </View>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Fecha de Registro</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{item.date_reg}</TextCatam>
                        </View>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Fecha Estimada de Cierre</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{item.date_oft}</TextCatam>
                        </View>
                    </View>
                </View>
                <View style={styles.lineHrz}/>
                <View style={styles.contFoot}>
                    <TextCatam others={{ fontSize: 12 }}>Prima Estimada: </TextCatam>
                    <TextCatam font='bold' others={{ fontSize: 14, color: Colors.greenDark }}>$ {item.prime}</TextCatam>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contentPotential: {
        flex: 1,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: Colors.grey,
        elevation: 3,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: "grey",
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 5,
        padding: 5,
    },
    contHead: {
        flex: 1,
        flexDirection: 'row',
    },
    headIconLeft: {
        width: "10%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    headPolicy: {
        width: "80%",
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headIconRight: {
        width: "10%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    contName: {
        width: "50%",
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignItems: 'center',
    },
    contArrow: {
        width: "50%",
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignItems: 'center',
    },
    contBody: {
        flex: 1,
        flexDirection: 'row',
    },
    bodyCol: {
        flex: 1,
        flexDirection: 'column',
    },
    contFoot: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconClaim: {
        borderRadius: 2,
        backgroundColor: Colors.greenLight,
        paddingLeft: 4,
        paddingRight: 4,
        paddingBottom: 2,
        paddingTop: 2,
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
    lineHrz: {
        width: '100%',
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.greenDark,
        marginTop: 3,
        marginBottom: 3,
    }
});