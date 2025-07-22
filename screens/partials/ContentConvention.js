import React from 'react';
import { StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
//Components
import Colors from "../../constants/Colors";
import TextCatam from "../../components/TextCatamaran";

export default class ContentConvention extends React.Component {
    moreInformation = (link) => {
        if (link) {
            WebBrowser.openBrowserAsync(link);
        } else {
            Alert.alert('Aviso', 'Sin novedades por el momento.', [{ text: 'OK' }]);
        }
    }

    render() {
        const { item } = this.props;
        return (
            <View style={styles.contConvent}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2 }}>
                        <TextCatam font='bold' others={{ fontSize: 14 }}>{item.description}</TextCatam>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TextCatam font='bold' others={{ fontSize: 12 }}>Destino</TextCatam>
                                <TextCatam others={{ fontSize: 12 }}>{item.destiny}</TextCatam>
                                <TextCatam font='bold' others={{ fontSize: 12 }}>Puntos para Calificar</TextCatam>
                                <TextCatam others={{ fontSize: 12 }}>{item.val_goal}</TextCatam>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextCatam font='bold' others={{ fontSize: 12 }}>Fecha de Evento</TextCatam>
                                <TextCatam others={{ fontSize: 12 }}>{item.date}</TextCatam>
                                <TextCatam font='bold' others={{ fontSize: 12 }}>Avance</TextCatam>
                                <TextCatam others={{ fontSize: 12 }}>{item.val_sales}</TextCatam>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.lineHrz}/>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <TouchableOpacity onPress={() => this.moreInformation(item.link)}>
                            <TextCatam font='bold' others={{ fontSize: 14, color: Colors.greenDark }}>
                                MÁS INFORMACIÓN
                            </TextCatam>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contConvent: {
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
    img: {
        width: '90%',
        height: '80%',
        resizeMode: 'contain',
    },
    lineHrz: {
        width: '100%',
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.greenDark,
        marginTop: 3,
        marginBottom: 3,
    }
});