import React from 'react';
import { Text } from 'react-native';

export default class TextCatamaran extends React.Component {
    render() {
        return (
            <Text
                allowFontScaling={false}
                style={{textAlign: 'center'}}
            >
                {this.props.children}
            </Text>
        );
    }
}