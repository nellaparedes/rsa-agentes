import React from 'react';

import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import icoMoonConfig from '../selection.json';
const IconFontCustom = createIconSetFromIcoMoon(icoMoonConfig, 'icomoon');

export default class IconCustom extends React.Component {
    render() {
        return (
            <IconFontCustom
                name={this.props.name}
                size={this.props.size}
                color={this.props.color}
                style={this.props.styles}
            />
        );
    }
}