# PortfolioPilot Mobile - Setup & Running Guide

## Project Overview
PortfolioPilot Mobile is a React Native + Expo application for portfolio analysis on mobile devices.

## Tech Stack
- **Framework**: React Native with Expo
- **Language**: JavaScript (No TypeScript)
- **Navigation**: React Navigation (Native Stack)
- **HTTP Client**: Axios
- **Charts**: React Native Chart Kit
- **Icons**: Expo Vector Icons
- **Styling**: React Native StyleSheet

## Folder Structure
```
src/
├── components/        # Reusable UI components
├── screens/          # Screen components (pages)
├── navigation/       # Navigation setup & configuration
├── services/         # API calls & external services
├── hooks/            # Custom React hooks
├── constants/        # Colors, spacing, constants
├── assets/           # Images, fonts, media files
App.js               # Main entry point
```

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Android Emulator or iOS Simulator (for testing)

### Installation Steps
1. Navigate to project directory:
   ```bash
   cd PortfolioPilotMobile
   ```

2. Dependencies already installed. If needed, install again:
   ```bash
   npm install
   ```

3. Clear cache (recommended after first setup):
   ```bash
   npm start -- --reset-cache
   ```

## Running the Application

### Start Development Server
```bash
npm start
```
This opens the Expo development menu.

### Run on Android Emulator
```bash
npm run android
```
Prerequisites:
- Android Studio installed
- Android Virtual Device (AVD) configured
- Emulator running

### Run on iOS Simulator (macOS only)
```bash
npm run ios
```

### Run on Web
```bash
npm run web
```

## Development Notes

### Installed Dependencies
- `@react-navigation/native` - Navigation library
- `@react-navigation/native-stack` - Stack navigator
- `@react-navigation/bottom-tabs` - Bottom tab navigator
- `react-native-screens` - Native navigation components
- `react-native-safe-area-context` - Safe area handling
- `react-native-gesture-handler` - Gesture support
- `react-native-reanimated` - Animation library
- `axios` - HTTP client
- `react-native-svg` - SVG support
- `react-native-chart-kit` - Charts & graphs
- `expo-linear-gradient` - Gradient backgrounds
- `@expo/vector-icons` - Icon library

### API Configuration
The app is configured to connect to the backend at: `http://localhost:5000/api`

To test API connectivity, use the "Test API" button on the TestScreen.

### Code Style Guidelines
- Use functional components only
- Use StyleSheet for all styles (no inline styles)
- Keep components modular and reusable
- Use constants for colors and spacing
- Follow React hooks conventions

### Debugging
1. **Console Logs**: View in terminal where `npm start` is running
2. **Expo DevTools**: Press `j` in terminal to open debugger
3. **React DevTools**: Component inspection via browser
4. **Network Requests**: Check console logs from Axios interceptors

## Common Issues & Solutions

### Issue: "Cannot find expo"
**Solution**: Install Expo globally
```bash
npm install -g expo-cli
```

### Issue: Port 8081 already in use
**Solution**: Kill the process or use different port
```bash
npm start -- --port 8082
```

### Issue: Module not found errors
**Solution**: Clear cache and reinstall
```bash
npm start -- --reset-cache
npm install
```

### Issue: API not connecting
**Ensure**: 
- Backend is running on `localhost:5000`
- Network permissions are granted
- For Android emulator, use `10.0.2.2` instead of `localhost`

## Project Structure Details

### `/src/components`
Reusable UI components like buttons, cards, modals

### `/src/screens`
Full screen components:
- `TestScreen.js` - API testing screen

### `/src/navigation`
Navigate configuration:
- `StackNavigator.js` - Main stack navigator setup

### `/src/services`
API integration:
- `api.js` - Axios client with interceptors

### `/src/constants`
App-wide constants:
- `colors.js` - Color palette
- `spacing.js` - Spacing values
- `index.js` - Export all constants

### `/src/hooks`
Placeholder for custom React hooks (to be added)

### `/src/assets`
Images, icons, fonts, other media files

## Next Steps After Verification

Once verified that the app runs:
1. Create authentication context
2. Build login/register screens
3. Implement portfolio screens
4. Add chart visualizations
5. Implement advisor connection features
6. Add navigation between screens

## Additional Resources
- [React Native Docs](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
