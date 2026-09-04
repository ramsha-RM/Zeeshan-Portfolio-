// import { capabilities } from '../data/site.js';
// import Chip from './ui/Chip.jsx';
// import Eyebrow from './ui/Eyebrow.jsx';
// import useFlyIn from '../hooks/useFlyIn.js';
// import useSplitText from '../hooks/useSplitText.js';
// import './Capabilities.css';

// export default function Capabilities() {
//   const left = useFlyIn({ stagger: 0.14 });
//   const right = useFlyIn({ stagger: 0.14, offset: 0.07 });
//   const statement = useSplitText(0.05);

//   return (
//     <section id="experts" className="section caps">
//       <div className="shell caps__grid">
//         <div className="caps__col caps__col--left" ref={left}>
//           {capabilities.left.map((c) => <Chip key={c.label} {...c} fly="left" />)}
//         </div>

//         <div className="caps__center">
//           <Eyebrow script data-reveal>{capabilities.eyebrow}</Eyebrow>
//           <p className="caps__statement" ref={statement}>{capabilities.statement}</p>
//         </div>

//         <div className="caps__col caps__col--right" ref={right}>
//           {capabilities.right.map((c) => <Chip key={c.label} {...c} fly="right" />)}
//         </div>
//       </div>
//     </section>
//   );
// }

import { capabilities } from "../data/site.js";
import Chip from "./ui/Chip.jsx";
import Eyebrow from "./ui/Eyebrow.jsx";
import useFlyIn from "../hooks/useFlyIn.js";
import useSplitText from "../hooks/useSplitText.js";
import "./Capabilities.css";

export default function Capabilities() {
  const left = useFlyIn({ stagger: 0.14 });
  const right = useFlyIn({ stagger: 0.14, offset: 0.07 });
  const statement = useSplitText(0.05);

  return (
    <section id="experts" className="section caps">
      <div className="shell caps__grid">
        <div className="caps__col caps__col--left" ref={left}>
          {capabilities.left.map((c) => (
            <Chip key={c.label} {...c} fly="left" />
          ))}
        </div>

        <div className="caps__center">
          <Eyebrow script data-reveal>
            {capabilities.eyebrow}
          </Eyebrow>

          <p className="caps__statement" ref={statement}>
            {capabilities.statement}
          </p>
        </div>

        <div className="caps__col caps__col--right" ref={right}>
          {capabilities.right.map((c) => (
            <Chip key={c.label} {...c} fly="right" />
          ))}
        </div>

      </div>
    </section>
  );
}