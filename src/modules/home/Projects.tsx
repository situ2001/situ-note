import Card from './ProjectCard';
import Button from "../../components/common/Button";

import type { Project } from '../../config/projects';
import projects from '../../config/projects';

const Projects = (
  { projects }: { projects: Project[] }
) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-medium">Projects</h2>
        <a href="/projects">
          <Button text="More" className="text-sm opacity-50" />
        </a>
      </div>

      <div className="relative">
        <div
          className="flex flex-col md:grid md:grid-cols-3 gap-4"
        >
          {projects.map((project, index) => (
            <div
              key={index}
              className="h-full"
            >
              <Card
                title={project.title}
                description={project.description}
                link={project.link}
                icon={project.icon}
                tags={project.tags}
                featured={project.featured}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectsWithProps = () => <Projects projects={projects} />;
export default ProjectsWithProps;
