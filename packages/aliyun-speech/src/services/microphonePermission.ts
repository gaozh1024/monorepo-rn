import { getRecordingPermissionsAsync, requestRecordingPermissionsAsync } from 'expo-audio';

export async function ensureMicrophonePermission(): Promise<boolean> {
  const permission = await getRecordingPermissionsAsync();

  if (permission.granted) {
    return true;
  }

  const requested = await requestRecordingPermissionsAsync();
  return requested.granted;
}
