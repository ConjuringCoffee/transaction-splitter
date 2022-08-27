import * as SecureStore from 'expo-secure-store';

interface Profile {
    name: string,
    budgetId: string,
    debtorAccountId: string,
    elegibleAccountIds: Array<string>
}

const storageKey = 'profiles';

const readProfiles = async (): Promise<Array<Profile>> => {
    const jsonValue = await SecureStore.getItemAsync(storageKey);

    if (!jsonValue) {
        return [];
    }

    return JSON.parse(jsonValue);
};

const saveProfiles = async (profiles: Array<Profile>) => {
    const jsonValue = JSON.stringify(profiles);
    await SecureStore.setItemAsync(storageKey, jsonValue, { keychainAccessible: SecureStore.WHEN_UNLOCKED });
};

export type { Profile };
export { readProfiles, saveProfiles };
