import { Icon } from '@ui-kitten/components';
import React from 'react';
import { ImageProps } from 'react-native';

const SettingsIcon = (props: Partial<ImageProps> | undefined) => (
    <Icon {...props} name='settings-2-outline' />
);

export default SettingsIcon;
