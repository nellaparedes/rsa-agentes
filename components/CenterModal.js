import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';

/**
 * Local replacement for react-native-modalbox (it calls BackHandler.removeEventListener,
 * removed from React Native). Supports the props this app uses: isOpen, style,
 * backdropPressToClose (ignored: backdrop never closes), onClosed.
 */
export default function CenterModal({ isOpen, style, children, onClosed }) {
    return (
        <Modal visible={!!isOpen} transparent animationType="fade" onRequestClose={onClosed || (() => {})}>
            <View style={styles.backdrop}>
                <View style={[styles.box, style]}>{children}</View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        overflow: 'hidden',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
