// import { useEffect, useRef } from 'react';

// export default function useSplitText(stagger = 0.05) {
//   const ref = useRef(null);

//   useEffect(() => {
//     const el = ref.current;
//     if (!el || el.dataset.split === 'done') return;
//     el.dataset.split = 'done';

//     const words = [];
//     const walk = (parent) => {
//       [...parent.childNodes].forEach((node) => {
//         if (node.nodeType === Node.TEXT_NODE) {
//           if (!node.textContent.trim()) return;
//           const frag = document.createDocumentFragment();
//           node.textContent.split(/(\s+)/).forEach((token) => {
//             if (!token) return;
//             if (!token.trim()) return frag.appendChild(document.createTextNode(token));
//             const outer = document.createElement('span');
//             outer.className = 'word';
//             const inner = document.createElement('span');
//             inner.textContent = token;
//             outer.appendChild(inner);
//             frag.appendChild(outer);
//             words.push(outer);
//           });
//           parent.replaceChild(frag, node);
//         } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
//           walk(node);
//         }
//       });
//     };
//     walk(el);
//     words.forEach((w, i) => w.style.setProperty('--d', (i * stagger).toFixed(2) + 's'));

//     const io = new IntersectionObserver(
//       (entries, ob) =>
//         entries.forEach((e) => {
//           if (!e.isIntersecting) return;
//           words.forEach((w) => w.classList.add('is-in'));
//           ob.disconnect();
//         }),
//       { threshold: 0.2, rootMargin: '0px 0px -6% 0px' }
//     );
//     io.observe(el);
//     return () => io.disconnect();
//   }, [stagger]);

//   return ref;
// }







import { useEffect, useRef } from "react";

export default function useSplitText(stagger = 0.05) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.split === "done") return;

    el.dataset.split = "done";

    const words = [];

    const walk = (parent) => {
      [...parent.childNodes].forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          if (!node.textContent.trim()) return;

          const frag = document.createDocumentFragment();

          node.textContent.split(/(\s+)/).forEach((token) => {
            if (!token) return;

            if (!token.trim()) {
              frag.appendChild(
                document.createTextNode(token)
              );
              return;
            }

            const outer = document.createElement("span");
            outer.className = "word";

            const inner = document.createElement("span");
            inner.textContent = token;

            outer.appendChild(inner);
            frag.appendChild(outer);

            words.push(outer);
          });

          parent.replaceChild(frag, node);
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.tagName !== "BR"
        ) {
          walk(node);
        }
      });
    };

    walk(el);

    words.forEach((word, i) => {
      word.style.setProperty(
        "--d",
        `${(i * stagger).toFixed(2)}s`
      );
    });

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          words.forEach((word) =>
            word.classList.add("is-in")
          );

          observer.disconnect();
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    io.observe(el);

    return () => io.disconnect();
  }, [stagger]);

  return ref;
}