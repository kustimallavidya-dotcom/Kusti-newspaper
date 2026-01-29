
export enum ThemeType {
  CLASSIC = 'Classic',
  KESARI = 'Kesari',
  BLUE = 'Modern Blue'
}

export interface NewsData {
  headline: string;
  body: string;
  reporterName: string;
  designation: string;
  image: string | null;
  logo: string | null;
  reporterImage: string | null;
  theme: ThemeType;
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
