import React from 'react';
import { StyleSheet, View } from 'react-native';
//Components
import Colors from "../../constants/Colors";
import TextCatam from "../../components/TextCatamaran";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

export default class ContentClaims extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let plan;
        let date_pay;
        let cause;

        if(this.props.plan) {
            plan = (
                <View>
                    <TextCatam font="bold" others={{ fontSize: 12 }}>Plan</TextCatam>
                    <TextCatam others={{ fontSize: 12 }}>{this.props.plan}</TextCatam>
                </View>
            );
        }
        if(this.props.date_pay) {
            date_pay = (
                <View>
                    <TextCatam font="bold" others={{ fontSize: 12 }}>Fecha de Pago</TextCatam>
                    <TextCatam others={{ fontSize: 12 }}>{this.props.date_pay}</TextCatam>
                </View>
            );
        }
        if(this.props.branch === 'A MEDICA' || this.props.branch === 'ASIST.MED.') {
            cause = (<TextCatam others={{ fontSize: 12 }}>Paciente: </TextCatam>);
        } else {
            cause = (<TextCatam others={{ fontSize: 12 }}>Evento: </TextCatam>);
        }

        return (
            <View style={styles.contentPolicy}>
                <View style={styles.contHead}>
                    <View style={styles.headPolicy}>
                        <TextCatam font="bold" others={{ fontSize: 12 }}>RECLAMO: {this.props.claim}</TextCatam>
                    </View>
                    <View style={styles.headInsurer}>
                        <TextCatam font="bold" others={{ fontSize: 12 }}>{this.props.insurer}</TextCatam>
                    </View>
                    <View style={styles.headIconRight}>
                        <View style={styles.iconClaim}>
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
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Póliza</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{this.props.poliza}</TextCatam>
                        </View>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Ramo</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{this.props.branch}</TextCatam>
                        </View>
                        {plan}
                    </View>
                    <View style={styles.bodyCol}>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Fecha de Registro</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{this.props.date_register}</TextCatam>
                        </View>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Valor Presentado</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>$ {this.props.value_present}</TextCatam>
                        </View>
                        {date_pay}
                    </View>
                </View>
                <View style={styles.lineHrz}/>
                <View style={styles.contFoot}>
                    {cause}
                    <TextCatam font='bold' others={{ fontSize: 12 }}>{this.props.patient}</TextCatam>
                </View>
                <View style={styles.contFoot}>
                    <TextCatam others={{ fontSize: 12 }}>Valor Pagado: </TextCatam>
                    <TextCatam font='bold' others={{ fontSize: 14, color: Colors.greenDark }}>$ {this.props.value_pay}</TextCatam>
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
        marginLeft: 15,
        marginRight: 15,
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
    iconClaim: {
        borderRadius: 2,
        backgroundColor: Colors.greenLight,
        paddingLeft: 4,
        paddingRight: 4,
        paddingBottom: 2,
        paddingTop: 2,
    },
    lineHrz: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: Colors.greenDark,
        marginTop: 3,
        marginBottom: 3,
    }
});