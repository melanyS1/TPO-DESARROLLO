import { NativeModules } from 'react-native';

console.log("MODULOS NATIVOS:", NativeModules);

const { ToastModule } = NativeModules;

export const showToast = (message: string) => {
  console.log("ToastModule:", ToastModule);

  if (ToastModule) {
    ToastModule.show(message);
  } else {
    console.log("❌ ToastModule no existe");
  }
};