## Panther Framework

- This project uses Panther framework conventions. Prefer `AppProvider` over manually assembling the default provider stack unless the app has a clear reason to own each provider directly.
- In Expo projects, install Panther native dependencies with `expo install` before trusting plain npm version resolution.
- If `@gaozh1024/rn-kit` UI renders without styles, check NativeWind, Tailwind content scanning, and Babel setup before changing framework code.
- For ordinary business pages, prefer the `AppScreen` pattern used by the Panther starter template.
- For API integration, prefer `createAPI` and the starter template's `src/data/api.ts` pattern.
- When project-level rules conflict with Panther guidance, keep the business project's deeper local rules and only use Panther guidance for the framework-specific parts.
