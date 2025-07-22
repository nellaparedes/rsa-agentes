import React from 'react';
import { StyleSheet, View, } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

//Components
import Colors from "../../constants/Colors";
import TextCatam from "../../components/TextCatamaran";
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

export default class ContentSac extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.contentPolicy}>
                <View style={styles.contHead}>
                    <View style={styles.headPolicy}>
                        <TextCatam font="bold" others={{ fontSize: 12 }}>PÓLIZA: {this.props.poliza}</TextCatam>
                    </View>
                    <View style={styles.headInsurer}>
                        <TextCatam font="bold" others={{ fontSize: 12 }}>CASO: {this.props.case}</TextCatam>
                    </View>
                    <View style={styles.headIconRight}>
                        <View style={styles.iconSac}>
                            <FontAwesomeIcon icon={faExclamation} name="exclamationcircleo" />
                        </View>
                    </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TextCatam font="bold" others={{ fontSize: 12 }}>Cliente: </TextCatam>
                    <TextCatam others={{ fontSize: 12 }}>{this.props.client}</TextCatam>
                </View>
                <View style={styles.contBody}>
                    <View style={styles.bodyCol}>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Aseguradora</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{this.props.insurer}</TextCatam>
                        </View>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Plan</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{this.props.plan}</TextCatam>
                        </View>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Fecha de Registro</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{this.props.date_register}</TextCatam>
                        </View>
                    </View>
                    <View style={styles.bodyCol}>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Tipo de Servicio</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{this.props.type}</TextCatam>
                        </View>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Contacto</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{this.props.contact}</TextCatam>
                        </View>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Fecha de Atención</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{this.props.date_atention}</TextCatam>
                        </View>
                    </View>
                </View>
                <View style={styles.lineHrz}/>
                <View style={styles.contFoot}>
                    <TextCatam others={{ fontSize: 12 }}>Paciente: </TextCatam>
                    <TextCatam font='bold' others={{ fontSize: 10 }}>{this.props.patient}</TextCatam>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contentPolicy: {
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
        width: "45%",
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headInsurer: {
        width: "45%",
        justifyContent: 'center',
        alignItems: 'flex-end',
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
    iconSac: {
        borderRadius: 2,
        backgroundColor: Colors.yellow,
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
        borderBottomWidth: 1,
        borderBottomColor: Colors.greenDark,
        marginTop: 3,
        marginBottom: 3,
    }
});