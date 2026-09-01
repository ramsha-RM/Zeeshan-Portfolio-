import { useEffect, useRef } from "react";
import Icon from "./ui/Icon.jsx";

import useMagnetic from "../hooks/useMagnetic.js";
import useShowreelTrans from "../hooks/useShowreelTrans.js";

import "./Showreel.css";

const TILES = [0, 1, 2, 3, 4, 5];

export default function Showreel({ showreelRef }) {
  const block = useRef(null);
  const glow = useRef(null);
  const grid = useRef(null);
  const label = useRef(null);

  const disc = useMagnetic();

  useShowreelTrans(grid, label);

  useEffect(() => {
    const b = block.current;
    const gl = glow.current;

    if (
      !b ||
      !gl ||
      !matchMedia("(pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const move = (e) => {
      const r = b.getBoundingClientRect();

      gl.style.left = `${e.clientX - r.left}px`;
      gl.style.top = `${e.clientY - r.top}px`;
    };

    const on = () => {
      gl.style.opacity = "1";
    };

    const off = () => {
      gl.style.opacity = "0";
    };

    b.addEventListener("pointermove", move);
    b.addEventListener("pointerenter", on);
    b.addEventListener("pointerleave", off);

    return () => {
      b.removeEventListener("pointermove", move);
      b.removeEventListener("pointerenter", on);
      b.removeEventListener("pointerleave", off);
    };
  }, []);

  return (
    <section ref={showreelRef} className="shell">
      <div className="reel" ref={block}>

        <span
          className="reel__glow"
          ref={glow}
        />

        <div
          className="reel__grid"
          ref={grid}
        >
          {TILES.map((i) => (
            <div
              key={i}
              className="reel__tile"
            />
          ))}
        </div>

        {/* Center CTA */}
        <div className="reel__center">

          <div
            className="reel__label"
            ref={label}
          >
            See Recent Work
          </div>

          <a
            href="#projects"
            className="reel__disc"
            ref={disc}
            aria-label="See recent work"
          >
            <Icon
              name="folder"
              size={22}
              stroke="#0a0b0c"
            />

            <span className="reel__ring" />
          </a>

        </div>
      </div>
    </section>
  );
}