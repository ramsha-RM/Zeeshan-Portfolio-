import { about } from '../data/site.js';
import Eyebrow from './ui/Eyebrow.jsx';
import SocialRow from './ui/SocialRow.jsx';
import useSplitText from '../hooks/useSplitText.js';
import './About.css';

export default function About() {
  const heading = useSplitText();

  return (
    <section id="about" className="section shell">
      <Eyebrow data-reveal>{about.eyebrow}</Eyebrow>
      <h2 className="h2" ref={heading}>
        {about.heading[0]} <span className="muted">{about.heading[1]}</span>
      </h2>

      <div className="about">
        <div data-reveal>
          <div className="about__photo">
            {/* drop the portrait in at src/assets/portrait.jpg and swap this div for an <img> */}
            <div className="about__photoInner" />
          </div>
          <div className="about__id">
            <SocialRow items={about.socials} />
            <div className="about__name">
              <div>{about.name}</div>
              <div className="about__role">{about.role}</div>
            </div>
          </div>
        </div>

        <div data-reveal className="about__right">
          <div className="about__bioWrap">
            <span className="about__dot" />
            <p className="about__bio">{about.bio}</p>
          </div>

          <div className="cv">
            {about.experience.map((row) => (
              <div className="cv__row" key={row.role}>
                <span>{row.role}</span>
                <span className="cv__company">{row.company}</span>
                <span className="cv__years">{row.from} &rarr; {row.to}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
