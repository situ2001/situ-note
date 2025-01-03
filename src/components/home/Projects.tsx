import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import { FiBook, FiPackage, FiCloud, FiTerminal, FiLayout, FiCode } from 'react-icons/fi';
import Button from "../common/Button";

const projectData = [
  {
    title: "VS Code Theme",
    description: "Custom Visual Studio Code theme with focus on readability and eye comfort.",
    link: "https://github.com/situ2001/vscode-theme",
    icon: "https://raw.githubusercontent.com/VSCodeThemes/static-picto/master/visual-studio-code.png",
    tags: ["VS Code", "Theme", "Design"]
  },
  {
    title: "Situ Note",
    description: "Personal blog and portfolio website built with Next.js and MDX. Features dark mode, responsive design, and markdown content management.",
    link: "https://github.com/situ2001/situ-note",
    icon: FiBook,
    tags: ["Next.js", "TypeScript", "MDX", "Tailwind"],
    featured: true
  },
  {
    title: "React Component Library",
    description: "A collection of reusable React components with Storybook documentation and comprehensive testing.",
    link: "https://github.com/situ2001/component-lib",
    icon: FiPackage,
    tags: ["React", "TypeScript", "Storybook", "Jest"],
    featured: true
  },
  {
    title: "Weather Dashboard",
    description: "Real-time weather monitoring dashboard using OpenWeatherMap API with location-based services.",
    link: "https://github.com/situ2001/weather-app",
    icon: FiCloud,
    tags: ["React", "APIs", "Geolocation", "Chart.js"],
    featured: true
  },
  {
    title: "Task Management CLI",
    description: "Command-line tool for managing tasks and projects with Git-like interface.",
    link: "https://github.com/situ2001/task-cli",
    icon: FiTerminal,
    tags: ["Node.js", "CLI", "TypeScript", "Jest"]
  },
  {
    title: "Portfolio Template",
    description: "Customizable portfolio template for developers with blog support and project showcase.",
    link: "https://github.com/situ2001/portfolio-template",
    icon: FiLayout,
    tags: ["Next.js", "Tailwind", "MDX", "React"]
  }
];

const Projects = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Projects</h2>
        <a href="/projects">
          <Button text="More" className="text-sm opacity-50" />
        </a>
      </div>

      <div className="relative">
        <motion.div
          layout
          className="flex flex-col md:grid md:grid-cols-3 gap-4"
        >
          {projectData.map((project, index) => (
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
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;
