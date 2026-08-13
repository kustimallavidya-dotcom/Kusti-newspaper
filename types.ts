
export enum ThemeType {
  CLASSIC = 'Classic',
  KESARI = 'Kesari',
  BLUE = 'Modern Blue'
}

export type SocialPreset = 'standard' | 'insta_post' | 'insta_story' | 'whatsapp' | 'facebook';

export interface NewsData {
  headline: string;
  body: string;
  reporterName: string;
  designation: string;
  image: string | null;
  logo: string | null;
  reporterImage: string | null;
  theme: ThemeType;
  paperTitle: string;
  paperSubTitle: string;
  titleFont?: 'rozha' | 'baloo' | 'kadwa' | 'mukta';
  headlineScale: number; // 0.7 to 1.6 scale
  bodyScale: number;     // 0.7 to 1.6 scale
  titleColor?: string;
  subTitleColor?: string;
  subTitleBgColor?: string;
  headlineColor?: string;
  bodyColor?: string;
  borderColorCustom?: string;
  headerBgCustom?: string;
}

export interface ThemeConfig {
  bgColor: string;
  headerBg: string;
  headerTextColor: string;
  accentColor: string;
  textColor: string;
  borderColor: string;
  stripColor: string;
}

