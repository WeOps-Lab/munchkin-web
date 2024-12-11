import { ListItem } from '@/types/global';

export const FREQUENCY_LIST: ListItem[] = [
  { label: 'off', value: 0 },
  { label: '1m', value: 60000 },
  { label: '5m', value: 300000 },
  { label: '10m', value: 600000 },
];

export const TIME_RANGE_LIST: ListItem[] = [
  { label: 'The past 15 minutes', value: 15 },
  { label: 'The past 30 minutes', value: 30 },
  { label: 'The past 1 hour', value: 60 },
  { label: 'The past 6 hours', value: 360 },
  { label: 'The past 12 hours', value: 720 },
  { label: 'The past 1 day', value: 1440 },
  { label: 'The past 7 days', value: 10080 },
  { label: 'The past 30 days', value: 43200 },
  { label: 'Custom', value: 0 },
];
