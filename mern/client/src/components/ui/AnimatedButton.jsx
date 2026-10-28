import { useLayoutEffect, useRef } from "react";
import "./AnimatedButton.css";

/**
 * Primary button — the Uiverse.io (marcelodolza) 3D button, recoloured to the
 * site palette and made to fit any label.
 *
 *   <AnimatedButton href="#contact" label="Let’s Talk" activeLabel="Let’s Go" size="sm" />
 *   <AnimatedButton type="submit" label="Send Message" tone="light" />
 *
 * Hover: shimmer + letter roll. Press/focus: splash, outline trace, arrow flies
 * across and `activeLabel` rolls in.
 */
const SPLASH = [
  [
    "M54.1054 99.7837C54.1054 99.7837 40.0984 90.7874 26.6893 97.6362C13.2802 104.485 1.5 97.6362 1.5 97.6362",
    1,
  ],
  [
    "M285.273 99.7841C285.273 99.7841 299.28 90.7879 312.689 97.6367C326.098 104.486 340.105 95.4893 340.105 95.4893",
    1,
  ],
  [
    "M281.133 64.9917C281.133 64.9917 287.96 49.8089 302.934 48.2295C317.908 46.6501 319.712 36.5272 319.712 36.5272",
    0.3,
  ],
  [
    "M281.133 138.984C281.133 138.984 287.96 154.167 302.934 155.746C317.908 157.326 319.712 167.449 319.712 167.449",
    0.3,
  ],
  [
    "M230.578 57.4476C230.578 57.4476 225.785 41.5051 236.061 30.4998C246.337 19.4945 244.686 12.9998 244.686 12.9998",
    1,
  ],
  [
    "M230.578 150.528C230.578 150.528 225.785 166.471 236.061 177.476C246.337 188.481 244.686 194.976 244.686 194.976",
    1,
  ],
  [
    "M170.392 57.0278C170.392 57.0278 173.89 42.1322 169.571 29.54C165.252 16.9478 168.751 2.05227 168.751 2.05227",
    0.3,
  ],
  [
    "M170.392 150.948C170.392 150.948 173.89 165.844 169.571 178.436C165.252 191.028 168.751 205.924 168.751 205.924",
    0.3,
  ],
  [
    "M112.609 57.4476C112.609 57.4476 117.401 41.5051 107.125 30.4998C96.8492 19.4945 98.5 12.9998 98.5 12.9998",
    1,
  ],
  [
    "M112.609 150.528C112.609 150.528 117.401 166.471 107.125 177.476C96.8492 188.481 98.5 194.976 98.5 194.976",
    1,
  ],
  [
    "M62.2941 64.9917C62.2941 64.9917 55.4671 49.8089 40.4932 48.2295C25.5194 46.6501 23.7159 36.5272 23.7159 36.5272",
    0.3,
  ],
  [
    "M62.2941 145.984C62.2941 145.984 55.4671 161.167 40.4932 162.746C25.5194 164.326 23.7159 174.449 23.7159 174.449",
    0.3,
  ],
];
const TRACE =
  "M182.674 2H203C211.837 2 219 9.16344 219 18V24C219 32.8366 211.837 40 203 40H18C9.16345 40 2 32.8366 2 24V18C2 9.16344 9.16344 2 18 2H47.8855";

const Letters = ({ text, className }) => (
  <span className={"char " + className}>
    {[...text].map((c, i) => {
      const ch = c === " " ? " " : c;
      return (
        <span key={i} data-label={ch} style={{ "--i": i + 1 }}>
          {ch}
        </span>
      );
    })}
  </span>
);

export default function AnimatedButton({
  href,
  label,
  activeLabel = label,
  size,
  tone = "dark",
  type = "button",
  className = "",
  onClick,
  ...rest
}) {
  const ref = useRef(null);

  // Park the arrow just left of the active label, whatever the label length.
  useLayoutEffect(() => {
    const btn = ref.current;
    if (!btn) return undefined;
    const place = () => {
      const icon = btn.querySelector(".icon");
      const content = btn.querySelector(".content");
      const active = btn.querySelector(".char.state-2");
      if (!icon || !content?.clientWidth) return;
      const shift =
        (content.clientWidth - active.offsetWidth) / 2 -
        icon.offsetWidth -
        12 -
        icon.offsetLeft;
      btn.style.setProperty("--arrow-shift", `${Math.round(shift)}px`);
    };
    place();
    document.fonts?.ready.then(place);
    const ro =
      typeof ResizeObserver === "function" ? new ResizeObserver(place) : null;
    ro?.observe(btn);
    return () => ro?.disconnect();
  }, [label, activeLabel]);

  const handleClick = (event) => {
    onClick?.(event);
    // In-page links keep focus after scrolling; release it so the button resets.
    if (href?.startsWith("#")) setTimeout(() => ref.current?.blur(), 1700);
  };

  const cls = [
    "zbtn",
    size === "sm" && "zbtn--sm",
    tone === "light" && "zbtn--light",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const inner = (
    <>
      <span className="bg" aria-hidden="true" />
      <svg
        className="splash"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 342 208"
      >
        {SPLASH.map(([d, o]) => (
          <path
            key={d}
            strokeLinecap="round"
            strokeWidth="3"
            strokeOpacity={o < 1 ? o : undefined}
            d={d}
          />
        ))}
      </svg>
      <span className="wrap" aria-hidden="true">
        <svg
          className="path"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 221 42"
          preserveAspectRatio="none"
        >
          <path
            strokeLinecap="round"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            d={TRACE}
          />
        </svg>
        <span className="outline" />
        <span className="content">
          <Letters text={label} className="state-1" />
          <span className="icon">
            <span className="arrow" />
          </span>
          <Letters text={activeLabel} className="state-2" />
        </span>
      </span>
    </>
  );

  return href ? (
    <a
      ref={ref}
      href={href}
      className={cls}
      aria-label={label}
      onClick={handleClick}
      {...rest}
    >
      {inner}
    </a>
  ) : (
    <button
      ref={ref}
      type={type}
      className={cls}
      aria-label={label}
      onClick={handleClick}
      {...rest}
    >
      {inner}
    </button>
  );
}
