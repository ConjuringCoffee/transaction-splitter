// Use approach from:
//   https://github.com/steve192/opencookbook-frontend/blob/c9e891a118c011e1c685bd44277843da483fbdd4/@types/react-native-paper-extensions/index.d.ts
//   Even though that code links to the main documentation, it doesn't actually follow the documentation's approach.
declare module ReactNativePaper {
    interface Theme {
        darkAppBar: boolean
    }

    interface ThemeColors {
        textOnAppBar: string
    }
}
