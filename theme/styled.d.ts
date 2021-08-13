
export type Color = string
export type FontSize = string
export type FontWeight = string
export type FontFamily = string

export interface Theme {
  // font family
  fontFamilyZH: FontFamily
  fontFamilyEN: FontFamily

  // Title
  fontSize1: FontSize
  fontSize2: FontSize
  fontSize3: FontSize
  fontSize4: FontSize
  fontSize5: FontSize
  fontSize6: FontSize

  fontLineHeight1: FontSize
  fontLineHeight2: FontSize
  fontLineHeight3: FontSize
  fontLineHeight4: FontSize
  fontLineHeight5: FontSize

  fontWeightBlod: FontWeight
  fontWeightMedium: FontWeight

  colorGreen: Color
  colorRed: Color
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
  }
}
