import React from 'react';
import { StyleSheet, View } from 'react-native';

//Components
import Colors from "../../constants/Colors";
import Icon from "../../components/IconCustom";
import TextCatam from "../../components/TextCatamaran";

export default class ContentPolicy extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let plan;
        let dependents;
        let frequency;
        let deductible;

        if (this.props.plan) {
            plan = (
                <View>
                    <TextCatam font="bold" others={{ fontSize: 12 }}>Plan</TextCatam>
                    <TextCatam others={{ fontSize: 12 }}>{this.props.plan}</TextCatam>
                </View>

            );
        }
        if (this.props.dependents) {
            dependents = (
                <View>
                    <TextCatam font="bold" others={{ fontSize: 12 }}>Dependientes</TextCatam>
                    <TextCatam others={{ fontSize: 12 }}>{this.props.dependents}</TextCatam>
                </View>
            );
        }
        if (this.props.frequency) {
            frequency = (
                <View>
                    <TextCatam font="bold" others={{ fontSize: 12 }}>Frecuencia</TextCatam>
                    <TextCatam others={{ fontSize: 12 }}>{this.props.frequency}</TextCatam>
                </View>
            );
        }
        if (this.props.deductible) {
            deductible = (
                <View>
                    <TextCatam font="bold" others={{ fontSize: 12 }}>Deducible</TextCatam>
                    <TextCatam others={{ fontSize: 12 }}>$ {this.props.deductible}</TextCatam>
                </View>
            );
        }

        return (
            <View style={styles.contentPolicy}>
                <View style={styles.contHead}>
                    <View style={styles.headIconLeft}>
                        <Icon name='policy' styles={{ color: Colors.greenDark, fontSize: 20 }} />
                    </View>
                    <View style={styles.headPolicy}>
                        <TextCatam font="bold" others={{ fontSize: 12 }}>PÓLIZA: {this.props.policy}</TextCatam>
                    </View>
                    <View style={styles.headInsurer}>
                        <TextCatam font="bold" others={{ fontSize: 12 }}>{this.props.insurer}</TextCatam>
                    </View>
                </View>
                <View style={styles.lineHrz} />
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TextCatam font="bold" others={{ fontSize: 12 }}>Cliente: </TextCatam>
                    <TextCatam others={{ fontSize: 12 }}>{this.props.client}</TextCatam>
                </View>
                <View style={styles.contBody}>
                    <View style={styles.bodyCol}>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Estado</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{this.props.status}</TextCatam>
                        </View>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Ramo</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{this.props.branch}</TextCatam>
                        </View>
                        {plan}
                        {dependents}
                    </View>
                    <View style={styles.bodyCol}>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>F. Vigencia</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{this.props.validity}</TextCatam>
                        </View>
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>F. Renovación</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{this.props.renew}</TextCatam>
                        </View>
                    </View>
                    <View style={styles.bodyCol}>
                        {frequency}
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Negocio</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>{this.props.deal}</TextCatam>
                        </View>
                        {deductible}
                        <View>
                            <TextCatam font="bold" others={{ fontSize: 12 }}>Prima Neta</TextCatam>
                            <TextCatam others={{ fontSize: 12 }}>$ {this.props.primenet}</TextCatam>
                        </View>
                    </View>
                </View>
                <View style={styles.lineHrz} />
                <View style={styles.contFoot}>
                    <TextCatam>Ejecutivo: </TextCatam>
                    <TextCatam font='bold'>{this.props.ejecutive}</TextCatam>
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
    },
    lineHrz: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: Colors.greenDark,
        marginTop: 3,
        marginBottom: 3,
    }
});