import { useState, useEffect } from 'react';
import { Profile, readProfiles } from '../Repository/ProfileRepository';

const useProfiles = (): [[Profile, Profile] | undefined] => {
    const [profiles, setProfiles] = useState<[Profile, Profile]>();

    useEffect(() => {
        readProfiles().then((profilesRead) => {
            if (profilesRead.length !== 2) {
                throw new Error('Cannot handle not having exactly two profiles yet');
            }

            setProfiles([profilesRead[0], profilesRead[1]]);
        }).catch((error) => {
            console.error(error);
            throw error;
        });
    }, []);

    return [profiles];
};

export default useProfiles;
