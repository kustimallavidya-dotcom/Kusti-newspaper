
import { ThemeType, ThemeConfig } from './types';

// We no longer use an external image for the logo, switching to a code-based icon.
export const DEFAULT_LOGO = null; 

export const THEMES: Record<ThemeType, ThemeConfig> = {
  [ThemeType.CLASSIC]: {
    bgColor: 'bg-white',
    headerBg: 'bg-white',
    headerTextColor: 'text-black',
    accentColor: 'border-black',
    textColor: 'text-black',
    borderColor: 'border-black',
    stripColor: 'bg-black text-white'
  },
  [ThemeType.KESARI]: {
    bgColor: 'bg-[#fffbf0]',
    headerBg: 'bg-[#ff9933]',
    headerTextColor: 'text-white',
    accentColor: 'border-[#b32400]',
    textColor: 'text-[#4a0e00]',
    borderColor: 'border-[#b32400]',
    stripColor: 'bg-[#b32400] text-white'
  },
  [ThemeType.BLUE]: {
    bgColor: 'bg-[#f0f9ff]',
    headerBg: 'bg-[#005cbf]',
    headerTextColor: 'text-white',
    accentColor: 'border-[#003366]',
    textColor: 'text-[#001a33]',
    borderColor: 'border-[#003366]',
    stripColor: 'bg-[#003366] text-white'
  }
};
