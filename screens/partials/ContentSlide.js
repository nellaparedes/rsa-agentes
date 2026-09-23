import React from 'react';
import { StyleSheet, View, ImageBackground, Dimensions } from 'react-native';

//Components
import Colors from "../../constants/Colors";
import TextCatam from "../../components/TextCatamaran";

export default class ContentSlide extends React.Component {
    render() {
        const { item } = this.props;
        return (
            <ImageBackground
                source={{uri: `${item.image}`}}
                style={[styles.contSlide, { width: Dimensions.get('window').width - 35 }]}
                imageStyle={styles.imgSlide}
            >
                <View style={{ flex: 4 }} />
                <View style={{ flex: 1, backgroundColor: '#FFFF', opacity: 0.8, padding: 10, justifyContent: 'center' }}>
                    <TextCatam font='bold' others={{ fontSize: 16, color: Colors.greenDark }}>{item.description}</TextCatam>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    contSlide: {
        marginLeft: 10,
        marginRight: 10,
        resizeMode: 'stretch',
    },
    imgSlide: {
        borderRadius: 5,
        resizeMode: 'cover',
    },
});