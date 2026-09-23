import React from 'react';

import Colors from '../constants/Colors';

import Icon from "./IconCustom";

export default function TabBarIcon(props) {
    return (
        <Icon
            name={props.name}
            size={26}
            style={{ marginBottom: -3 }}
            color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />
    );
}
