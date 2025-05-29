import { View, Text } from 'react-native'
import React from 'react'

const Flex_Box = ({ style, children }) => {

    const style_obj = style || {};

    return (
        <View
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                ...style_obj
            }}
        >
            {children}
        </View>
    )
}

export default Flex_Box