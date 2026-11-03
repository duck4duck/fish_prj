declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const TouchableOpacity: any;
  export const Image: any;
  export const StyleSheet: any;
  export const Modal: any;
  export const ScrollView: any;
  export const TextInput: any;
  export const ActivityIndicator: any;
}

declare module 'react-native-web';

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
