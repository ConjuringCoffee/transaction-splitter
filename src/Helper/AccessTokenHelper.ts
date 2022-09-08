import { getItemAsync, setItemAsync, WHEN_UNLOCKED } from 'expo-secure-store';

const getAccessTokenFromKeychain = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        getItemAsync('access-token',
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
    await setItemAsync('access-token', accessToken, { keychainAccessible: WHEN_UNLOCKED });
};

export { getAccessTokenFromKeychain, saveAccessTokenToKeychain };
