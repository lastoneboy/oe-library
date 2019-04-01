import { css } from 'emotion';
import * as colors from './colors';
import { Theme } from './ThemeContext';

export function getButtonIconClass(theme: Theme) {
  return css`
    width: 5.03mm;
    margin-right: 2.38mm;
    fill: ${colors.OMF_Button_Icon_ena};
  `;
}

export function getButtonBaseClass(theme: Theme) {
  return css`
    background: linear-gradient(
      180deg,
      ${colors.OMF_Button_Gradient_00_ena},
      ${colors.OMF_Button_Gradient_01_ena}
    );
    color: ${colors.OMF_Button_Text_ena};
    outline: 0;
    &:not([disabled]):active:hover {
      background: linear-gradient(
        180deg,
        ${colors.OMF_Button_Gradient_00_prs},
        ${colors.OMF_Button_Gradient_01_prs}
      );
      color: ${colors.OMF_Button_Text_prs};
      .${getButtonIconClass(theme)} {
        fill: ${colors.OMF_Button_Icon_prs};
      }
    }
    &[disabled] {
      background: linear-gradient(
        180deg,
        ${colors.OMF_Button_Gradient_00_dis},
        ${colors.OMF_Button_Gradient_01_dis}
      );
      color: ${colors.OMF_Button_Text_dis};
      .${getButtonIconClass(theme)} {
        fill: ${colors.OMF_Button_Icon_dis};
      }
    }
    &:focus {
      outline: 0.53mm solid ${colors.OMF_Border_Focus};
    }
  `;
}

export function getInputDisabledClass(theme: Theme) {
  return css`
    background: ${colors.OMF_Textcomponent_Background_dis};
    color: ${colors.OMF_Textcomponent_Text_dis};
  `;
}

export function getInputReadOnlyClass(theme: Theme) {
  return css`
    background: ${colors.OMF_Textcomponent_Background_Readonly_ena};
    color: ${colors.OMF_Textcomponent_Text_Readonly_ena};
  `;
}

export function getInputClass(theme: Theme) {
  return css`
    background: ${colors.OMF_Textcomponent_Background_ena};
    color: ${colors.OMF_Textcomponent_Text_ena};

    &:[disabled] {
      ${getInputDisabledClass(theme)}
    }

    &:[disabled].${getInputReadOnlyClass(theme)} {
      ${getInputReadOnlyClass(theme)}
    }
  `;
}
