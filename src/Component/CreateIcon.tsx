import { Icon } from '@ui-kitten/components';
import { ImageProps } from 'react-native';

const CreateIcon = (props: Partial<ImageProps> | undefined) => (
    <Icon {...props} name='plus-outline' />
);

export default CreateIcon;
