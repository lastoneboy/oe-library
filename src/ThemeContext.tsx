import * as React from 'react';

export enum Theme {
  Light,
  Dark,
}

export const ThemeContext = React.createContext(Theme.Light);
