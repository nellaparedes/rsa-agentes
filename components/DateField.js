import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Parses a "DD-MM-YYYY" string into a Date. Falls back to today when empty or invalid.
function parseDate(value) {
    if (typeof value === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
        const [day, month, year] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        if (!Number.isNaN(date.getTime())) {
            return date;
        }
    }
    return new Date();
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}-${month}-${date.getFullYear()}`;
}

/**
 * Drop-in replacement for the unmaintained react-native-datepicker.
 * Props: value ("DD-MM-YYYY" string), placeholder, onChange(value), style, textStyle, placeholderStyle.
 */
export default class DateField extends React.Component {
    state = { open: false };

    handleChange = (event, selected) => {
        if (Platform.OS === 'android') {
            this.setState({ open: false });
        }
        if (event.type === 'dismissed' || !selected) {
            return;
        }
        this.props.onChange(formatDate(selected));
    };

    render() {
        const { value, placeholder, style, textStyle, placeholderStyle } = this.props;
        const { open } = this.state;
        return (
            <View>
                <TouchableOpacity style={style} onPress={() => this.setState({ open: !open })}>
                    <Text style={value ? textStyle : placeholderStyle || textStyle}>
                        {value || placeholder}
                    </Text>
                </TouchableOpacity>
                {open && (
                    <DateTimePicker
                        value={parseDate(value)}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={this.handleChange}
                    />
                )}
            </View>
        );
    }
}
