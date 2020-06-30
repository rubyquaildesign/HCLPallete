import React, { memo } from 'react';

import * as S from '../../../stateCode';
import Swatch from './Swatch';
import styled from 'styled-components';
import PH from './PalleteHeader';
import './Pallete.scss';
const HB = styled.button`
  border: 0;
  font-size: 1.2em;
  transform-origin: 50% 50%;
  transform: scale(1);
  background: 0;
  cursor: pointer;
  width: fit-content;
  justify-self: end;
  padding: 0.05em 0.2em;
  margin-right: 0.2em;
  margin-top: 0.2em;
  font-weight: 400;
  border-radius: 25%;
  transition: transform 233ms, background-color 64ms;
  background-color: transparent;
  color: var(--text-col);
  &:hover {
    font-weight: 800;
  }
  &:active {
    background-color: lightgray;
  }
  &:focus {
    outline: none;
  }
`;

interface Props {
  st: S.State;
  dispatch: React.Dispatch<S.Actions>;
}
// Comment
export function Pallete({ st, dispatch }: Props) {
  const detBox = React.useRef<HTMLInputElement>();
  const [details, setDetails] = React.useState(!!detBox.current?.checked);
  const selected = st.selected;
  const selectedColour =
    st.selected[0] > -1
      ? st.colours[st.selected[0]][st.selected[1]].hex
      : '#ffffff';

  React.useEffect(() => dispatch(S.selectColour({ hue: -1, shade: -1 })), []);

  return (
    <table style={{ borderSpacing: 0, fontFamily: 'fira code' }}>
      <tbody>
        <tr>
          <td style={{ fontSize: '0.8em' }}>
            <input
              ref={detBox}
              type='checkbox'
              name='details'
              onChange={(e) => setDetails(e.currentTarget.checked)}
            />
            Details
          </td>
          {st.shades.map((sh, i) => {
            return (
              <PH
                info={st.shades[i]}
                index={i}
                LayerLength={st.shades.length}
                dispatch={dispatch}
                key={i}
              />
            );
          })}
          <td>
            <HB
              onClick={(e) => {
                dispatch(S.addLayer('shade'));
              }}
              style={{ verticalAlign: 'middle', fontSize: '1.5em' }}
            >
              +
            </HB>
          </td>
        </tr>
        {st.colours.map((hue, hueIndex) => {
          return (
            <tr key={hueIndex}>
              <PH
                info={st.hues[hueIndex]}
                index={hueIndex}
                LayerLength={st.hues.length}
                dispatch={dispatch}
                style={{
                  backgroundColor:
                    hueIndex === selected[0]
                      ? 'var(--bg-highlight)'
                      : 'transparent',

                  transition: 'background-color 233ms',
                }}
              />
              {hue.map((col, shadeIndex) => {
                return (
                  <td
                    key={shadeIndex}
                    style={{
                      backgroundColor:
                        hueIndex === selected[0] || shadeIndex === selected[1]
                          ? 'var(--bg-highlight)'
                          : 'transparent',

                      transition: 'background-color 233ms',
                      textAlign: 'center',
                    }}
                  >
                    <Swatch
                      key={shadeIndex}
                      color={col}
                      details={details}
                      selectedColor={selectedColour}
                      location={{ hue: hueIndex, shade: shadeIndex }}
                      selected={
                        hueIndex === selected.hue &&
                        shadeIndex === selected.shade
                      }
                      dispatch={dispatch}
                    />
                  </td>
                );
              })}
            </tr>
          );
        })}
        <tr>
          <HB
            onClick={(e) => {
              dispatch(S.addLayer('hue'));
            }}
            style={{ verticalAlign: 'middle', fontSize: '1.5em' }}
          >
            +
          </HB>
        </tr>
      </tbody>
    </table>
  );
}