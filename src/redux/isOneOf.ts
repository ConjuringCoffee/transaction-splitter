// Taken from https://stackoverflow.com/a/64917926

import { Action } from '@reduxjs/toolkit';

type TypedActionCreator<Type extends string> = {
    (...args: any[]): Action<Type>;
    type: Type;
}

export const isOneOf = <ActionCreator extends TypedActionCreator<string>>(actions: ActionCreator[]) => (
    (action: Action): action is ReturnType<ActionCreator> => (
        actions.map(({ type }) => type).includes(action.type)
    )
);
