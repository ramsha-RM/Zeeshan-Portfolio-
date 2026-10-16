
// import { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { projects as fallback } from "../data/site.js";
// import Eyebrow from "./ui/Eyebrow.jsx";
// import Icon from "./ui/Icon.jsx";
// import useSplitText from "../hooks/useSplitText.js";
// import useCursorFollower from "../hooks/useCursorFollower.js";
// import useProjectsAnimation from "../hooks/useProjectsAnimation.js";
// import "./Projects.css";

// export default function Projects() {
//   const [items, setItems] = useState(fallback.slice(0, 6));
//   const apiBase = import.meta.env.VITE_API_URL || '';

//   const heading = useSplitText();
//   const { zone, dot } = useCursorFollower();
//   const sectionRef = useProjectsAnimation([items.length]);

//   useEffect(() => {
//     fetch(`${apiBase}/api/projects`)
//       .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
//       .then((d) => {
//         if (Array.isArray(d) && d.length) {
//           setItems(d.slice(0, 6));
//         }
//       })
//       .catch(() => {});
//   }, [apiBase]);

//   return (
//     <section id="projects" className="section shell" ref={sectionRef}>
//       <Eyebrow data-reveal>Our Projects</Eyebrow>

//       <h2 className="h2" ref={heading}>
//         Recent Case Studies
//       </h2>

//       <div className="projects" ref={zone}>
//         {items.map((p, i) => (
//           <article
//             className="project"
//             key={p.slug}
//             style={{
//               "--d": `${(i % 4) * 0.08}s`,
//             }}
//           >
//             <a
//               className="project__plate"
//               href={`#${p.slug}`}
//               aria-label={p.name}
//             >
//               {p.image && (
//                 <img
//                   src={p.image}
//                   alt={`${p.name} case study`}
//                   loading="lazy"
//                 />
//               )}
//             </a>

//             <div className="project__meta">
//               <span>{p.name}</span>

//               <span className="project__tags">
//                 {p.tags.map((t) => (
//                   <span key={t}>{t}</span>
//                 ))}
//               </span>
//             </div>
//           </article>
//         ))}
//       </div>

//       {createPortal(
//         <div className="projects__cursor" ref={dot} aria-hidden="true">
//           <Icon name="arrow" size={22} stroke="#f7f7f6" width={2} />
//         </div>,
//         document.body
//       )}
//     </section>
//   );
// }
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { projects as fallback } from "../data/site.js";
import { api, apiBase } from "../lib/api.js";
import Eyebrow from "./ui/Eyebrow.jsx";
import Icon from "./ui/Icon.jsx";
import useSplitText from "../hooks/useSplitText.js";
import useCursorFollower from "../hooks/useCursorFollower.js";
import useProjectsAnimation from "../hooks/useProjectsAnimation.js";
import "./Projects.css";

export default function Projects() {
  const [items, setItems] = useState(fallback.slice(0, 6));

  const heading = useSplitText();
  const { zone, dot } = useCursorFollower();
  const sectionRef = useProjectsAnimation([items.length]);

  useEffect(() => {
    let active = true;
    let refreshing = false;
    let refreshPending = false;
    let errorLogged = false;

    const refresh = async () => {
      if (!active || document.hidden) return;
      if (refreshing) {
        refreshPending = true;
        return;
      }
      refreshing = true;
      try {
        const data = await api("/api/projects");
        if (!Array.isArray(data)) {
          throw new Error("The project list response was invalid.");
        }
        if (active) setItems(data);
        errorLogged = false;
      } catch (error) {
        if (active && !errorLogged) {
          console.error("Could not refresh public projects:", error);
          errorLogged = true;
        }
      } finally {
        refreshing = false;
        if (refreshPending && active && !document.hidden) {
          refreshPending = false;
          refresh();
        }
      }
    };

    const refreshWhenVisible = () => {
      if (!document.hidden) refresh();
    };

    const events = new EventSource(`${apiBase}/api/projects/events`, { withCredentials: true });
    events.addEventListener("projects-changed", refreshWhenVisible);
    refresh();
    const interval = window.setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("focus", refreshWhenVisible);

    return () => {
      active = false;
      events.close();
      window.clearInterval(interval);
      events.removeEventListener("projects-changed", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("focus", refreshWhenVisible);
    };
  }, []);

  return (
    <section id="projects" className="section shell" ref={sectionRef}>
      <Eyebrow data-reveal>Our Projects</Eyebrow>

      <h2 className="h2" ref={heading}>
        Recent Case Studies
      </h2>

      <div className="projects" ref={zone}>
        {items.map((p, i) => (
          <article
            className="project"
            key={p.slug}
            style={{
              "--d": `${(i % 4) * 0.08}s`,
            }}
          >
            <Link
              className="project__plate"
              to={`/projects/${p.slug}`}
              aria-label={p.name}
            >
              {p.image && (
                <img
                  src={p.image}
                  alt={`${p.name} case study`}
                  loading="lazy"
                />
              )}
            </Link>

            <div className="project__meta">
              <span>{p.name}</span>

              <span className="project__tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </span>
            </div>
          </article>
        ))}
      </div>

      {createPortal(
        <div className="projects__cursor" ref={dot} aria-hidden="true">
          <Icon name="arrow" size={22} stroke="#f7f7f6" width={2} />
        </div>,
        document.body
      )}
    </section>
  );
}