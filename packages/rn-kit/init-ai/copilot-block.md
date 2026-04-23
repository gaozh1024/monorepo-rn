## Panther Framework Guidance

- Prefer `AppProvider` as the default Panther app bootstrap.
- In Expo projects, install native dependencies with `expo install`.
- Treat NativeWind and Tailwind setup as mandatory for `@gaozh1024/rn-kit` UI styling.
- Use `@gaozh1024/expo-starter` as the canonical integration reference for provider layout, navigation wiring, and `createAPI` usage.
- Prefer stable public APIs and published examples over guessing from internal implementation files.
