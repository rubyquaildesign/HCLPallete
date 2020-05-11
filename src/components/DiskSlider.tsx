import React, { useState, useEffect, useRef } from 'react';
import * as t from '../types';
import { DiskBack } from './DiskBack';
import DM from './DiskMarker';
import DH from './DiskHandle';
export const TAU = Math.PI * 2;
const toRAD = (a) => a * (TAU / 360);
const toDEG = (a) => a * (360 / TAU);

interface Props {
    value?: number;
    c?: number;
    l?: number;
    rad?: number;
    output?: (value: number) => any;
    color?: string;
    realVal?: number;
}
const DiskSlider = ({
    c = 80,
    l = 30,
    rad = 16,
    value = 90,
    output = (v) => console.log(v),
    color = '#555555',
}: Props) => {
    const [isDragged, setDrag] = useState(false);
    const svgRef = useRef<SVGSVGElement>();
    const inpRef = useRef<HTMLInputElement>();
    const divRef = useRef<HTMLDivElement>();
    const isLight = l < 50;
    const val = value;

    if (inpRef.current) inpRef.current.value = value.toFixed(1);
    useEffect(() => {
        const {
            width: {
                baseVal: { value: w },
            },
            height: {
                baseVal: { value: h },
            },
        } = svgRef.current;

        function updateValue({ x, y }: { x: number; y: number }) {
            if (!isDragged) return;
            const rawAngle = Math.atan2(y, x) + TAU / 4;

            const angle = rawAngle < 0 ? TAU + rawAngle : rawAngle;

            output(angle / TAU);
        }
        svgRef.current.onmousemove = (e) => {
            const { offsetX: x, offsetY: y } = e;

            updateValue({ x: x - w / 2, y: y - h / 2 });
        };
        divRef.current.onmouseup = () => {
            setDrag(false);
        };
    });

    return (
        <div
            style={{ display: 'inline-grid', gridTemplate: '1fr / 1fr' }}
            ref={divRef}>
            <svg
                width={rad + 'em'}
                ref={svgRef}
                height={rad + 'em'}
                style={{ gridArea: '1/1/1/1' }}
                viewBox={`-1 -1 2 2`}>
                <DiskBack c={c} l={l} count={128} />
                <DM light={isLight} value={value / 360} />
                <DH
                    colour={color}
                    light={isLight}
                    value={value / 360}
                    mD={(e) => {
                        setDrag(true);
                    }}
                    pushed={isDragged}
                />
            </svg>
            <input
                type='text'
                ref={inpRef}
                defaultValue={val}
                style={{
                    width: (6 / 16) * rad + 'em',
                    height: (2 / 16) * rad + 'em',
                    margin: 'auto',
                    gridArea: '1/1/1/1',
                    border: '#00000000',
                    font: (1.5 / 16) * rad + 'em Fira Code',
                    color: ' #232323',
                    textAlign: 'center',
                }}
                onKeyDown={(e) => {
                    if (/[0-9]|Backspace|Delete|Left|Right/.test(e.key)) {
                        return true;
                    } else e.preventDefault();
                    if (/Enter/.test(e.key)) {
                        let n = Number.parseFloat(inpRef.current.value) ?? 0;

                        n = n < 0 ? 0 : n > 360 ? 360 : n;
                        output(n / 360);
                    }
                }}
            />
        </div>
    );
};

export default DiskSlider;
export type BackProps = { c: number; l: number; count: number };