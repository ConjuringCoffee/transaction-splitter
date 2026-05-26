import Constants from 'expo-constants';

export const isPreviewVariant = (): boolean =>
    Constants.expoConfig?.extra?.isPreview === true;
