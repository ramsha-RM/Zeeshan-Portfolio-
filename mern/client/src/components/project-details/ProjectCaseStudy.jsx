import ProjectHero from './ProjectHero.jsx';
import ProjectIntro from './ProjectIntro.jsx';
import ProjectSections from './ProjectSections.jsx';
import ProjectHighlights from './ProjectHighlights.jsx';
import ProjectScreens from './ProjectScreens.jsx';

export default function ProjectCaseStudy({
  project,
  editable = false,
  update,
  add,
  remove
}) {
  return (
    <div className={editable ? 'pd__caseStudy pd__caseStudy--editable' : 'pd__caseStudy'}>
      <ProjectHero project={project} editable={editable} update={update} />
      <ProjectIntro project={project} editable={editable} update={update} add={add} remove={remove} />
      <ProjectSections project={project} editable={editable} update={update} add={add} remove={remove} />
      <ProjectHighlights project={project} editable={editable} update={update} add={add} remove={remove} />
      <ProjectScreens project={project} editable={editable} update={update} />
    </div>
  );
}
