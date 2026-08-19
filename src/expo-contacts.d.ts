import 'expo-contacts';

declare module 'expo-contacts' {
  interface Contact {
    id?: string;
    name?: string;
    phoneNumbers?: Array<{ number?: string | null }>;
  }
}
