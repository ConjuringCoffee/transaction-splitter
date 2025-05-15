import { Store } from '../store';

export type RootState = ReturnType<typeof Store.getState>;
