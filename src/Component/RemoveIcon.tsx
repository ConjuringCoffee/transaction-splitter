import { Icon } from '@ui-kitten/components';
import React from 'react';
import { ImageProps } from 'react-native';

const RemoveIcon = (props: Partial<ImageProps> | undefined) => (
    <Icon {...props} name='trash-2-outline' />
);

export default RemoveIcon;
