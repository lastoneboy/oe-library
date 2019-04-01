import { css } from 'emotion';
import { Theme } from './ThemeContext';

export function getFont1Class(theme: Theme) {
  return css`
    font-size: 15pt;
    font-weight: normal;
    font-family: Arial;
  `;
}

export function getFont3Class(theme: Theme) {
  return css`
    font-size: 10pt;
    font-family: Arial;
    font-weight: normal;
  `;
}

export function getFont4Class(theme: Theme) {
  return css`
    font-size: 8pt;
    font-family: Arial;
    font-weight: normal;
  `;
}

export function getFont8Class(theme: Theme) {
  return css`
    font-size: 15pt;
    font-family: 'Arial Rounded MT', Arial;
    font-weight: bold;
  `;
}
