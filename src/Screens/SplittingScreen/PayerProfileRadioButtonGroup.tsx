import { RadioButton } from 'react-native-paper';
import { Profile } from '../../redux/features/profiles/profilesSlice';

interface Props {
    profiles: Profile[],
    payerProfileIndex: number,
    setPayerProfileIndex: (index: number) => void,
}

export const PayerProfileRadioButtonGroup = (props: Props) => {
    return (
        <RadioButton.Group
            onValueChange={(newValue) => props.setPayerProfileIndex(Number(newValue))}
            value={props.payerProfileIndex.toString()}
        >
            <RadioButton.Item label={props.profiles[0].name} value={'0'} />
            <RadioButton.Item label={props.profiles[1].name} value={'1'} />
        </RadioButton.Group>
    );
};
