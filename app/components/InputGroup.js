import React, { PureComponent } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import * as CSS from '../res/css'

/**
 * @typedef {object} Props
 * @prop {(string)=} label
 * @prop {string} value
 * @prop {((text: string) => void)=} onChange
 * @prop {(object)=} style
 * @prop {(object)=} inputStyle
 * @prop {(string)=} icon
 * @prop {(boolean)=} disabled
 * @prop {(boolean)=} multiline
 * @prop {(string)=} placeholder
 * @prop {(object)=} labelStyle
 * @prop {(any)=} reactRef
 * @prop {(import('react-native').KeyboardType)=} type
 */

/**
 * @augments PureComponent<Props>
 */
class InputGroup extends PureComponent {
  theme = 'dark'

  mounted = false

  async componentDidMount() {}

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const {
      label,
      value,
      onChange,
      style,
      inputStyle,
      icon,
      disabled,
      multiline,
      placeholder,
      labelStyle,
      reactRef,
      type = 'default',
    } = this.props

    return (
      <View
        style={[
          styles.inputGroup,
          style,
          disabled ? styles.disabledContainer : null,
        ]}
      >
        {label ? (
          <Text
            style={[
              this.theme === 'dark' ? styles.labelDark : styles.label,
              labelStyle,
            ]}
          >
            {label}
          </Text>
        ) : null}

        <View
          style={[
            styles.inputContainerDark,
            inputStyle,
            disabled ? styles.disabledInput : null,
          ]}
        >
          {icon ? <Ionicons name={icon} color="#CBC5C5" size={22} /> : null}
          <TextInput
            style={[styles.inputDark, multiline ? styles.multilineInput : null]}
            ref={reactRef}
            keyboardType={type}
            value={value}
            editable={!disabled}
            multiline={multiline}
            placeholder={placeholder}
            onChangeText={onChange}
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputGroup: {
    width: '100%',
    marginBottom: 42,
  },
  label: {
    fontSize: 14,
    color: CSS.Colors.TEXT_GRAY_LIGHTER,
    fontFamily: 'Montserrat-600',
    marginBottom: 11,
  },
  labelDark: {
    fontSize: 14,
    color: CSS.Colors.TEXT_WHITE,
    fontFamily: 'Montserrat-600',
    marginBottom: 11,
  },
  disabledContainer: {
    opacity: 0.7,
  },
  inputContainerDark: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 13,
    height: 45,
    marginBottom: 10,
    backgroundColor: '#212937',
    borderWidth: 1,
    borderColor: '#4285B9',
    overflow: 'hidden',
    opacity: 0.7,
  },
  disabledInput: {
    elevation: 0,
  },
  inputDark: {
    flex: 1,
    fontFamily: 'Montserrat-600',
    textAlignVertical: 'center',
    fontSize: 12,
    color: CSS.Colors.TEXT_WHITE,
  },
  multilineInput: {
    height: '100%',
    textAlignVertical: 'top',
  },
})

export default InputGroup
