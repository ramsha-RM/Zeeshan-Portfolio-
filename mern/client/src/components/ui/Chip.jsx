// import Icon from './Icon.jsx';

// export default function Chip({ label, color, icon, fly }) {
//   return (
//     <div className="chip" data-fly={fly}>
//       <span className="chip__icon" style={{ background: color }}>
//         <Icon name={icon} size={12} stroke="#fff" width={2.2} />
//       </span>
//       {label}
//     </div>
//   );
// }

import Icon from "./Icon.jsx";

export default function Chip({ label, color, icon, fly }) {
  return (
    <div className="chip" data-fly={fly}>
      <span
        className="chip__icon"
        style={{ background: color }}
      >
        <Icon
          name={icon}
          size={12}
          stroke="#fff"
          width={2.2}
        />
      </span>

      {label}
    </div>
  );
}