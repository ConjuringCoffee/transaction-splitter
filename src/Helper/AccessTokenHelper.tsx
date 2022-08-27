import * as SecureStore from 'expo-secure-store';

const getAccessTokenFromKeychain = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        SecureStore.getItemAsync('access-token',
        ).then((value) => {
            if (value) {
                resolve(value);
            } else {
                resolve('');
            }
        }).catch((error) => {
            console.log(error.message);
            reject(error);
        });
    });
};

const saveAccessTokenToKeychain = async (accessToken: string) => {
    await SecureStore.setItemAsync('access-token', accessToken, { keychainAccessible: SecureStore.WHEN_UNLOCKED });
};

export { getAccessTokenFromKeychain, saveAccessTokenToKeychain };
