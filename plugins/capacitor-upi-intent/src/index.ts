import { registerPlugin } from '@capacitor/core';
import type { UpiIntentPlugin } from './definitions';

const UpiIntent = registerPlugin<UpiIntentPlugin>('UpiIntent');

export * from './definitions';
export { UpiIntent };
