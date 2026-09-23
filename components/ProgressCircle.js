import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

/**
 * Local replacement for the unmaintained react-native-progress-circle (it imports
 * ViewPropTypes, removed from React Native). Same props: percent, radius, borderWidth,
 * color, shadowColor, bgColor, outerCircleStyle, children.
 */
export default function ProgressCircle({
    percent = 0,
    radius = 20,
    borderWidth = 2,
    color = '#3b5998',
    shadowColor = '#eeeeee',
    bgColor = '#ffffff',
    outerCircleStyle,
    containerStyle,
    children,
}) {
    const size = radius * 2;
    const innerRadius = radius - borderWidth / 2;
    const circumference = 2 * Math.PI * innerRadius;
    const clamped = Math.min(100, Math.max(0, Number(percent) || 0));
    const progress = circumference * (1 - clamped / 100);

    return (
        <View style={[{ width: size, height: size }, outerCircleStyle]}>
            <Svg width={size} height={size}>
                <Circle cx={radius} cy={radius} r={innerRadius} fill={bgColor} stroke={shadowColor} strokeWidth={borderWidth} />
                <Circle
                    cx={radius}
                    cy={radius}
                    r={innerRadius}
                    fill="none"
                    stroke={color}
                    strokeWidth={borderWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={progress}
                    strokeLinecap="butt"
                    transform={`rotate(-90 ${radius} ${radius})`}
                />
            </Svg>
            <View style={[{ position: 'absolute', top: 0, left: 0, width: size, height: size, alignItems: 'center', justifyContent: 'center' }, containerStyle]}>
                {children}
            </View>
        </View>
    );
}
