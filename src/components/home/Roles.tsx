import type { ReactNode } from 'react'

type TechStack = {
  name: string;
  icon: string;
}

interface Role {
  title: string;
  company?: string;
  description: string;
  techStack: TechStack[];
  projects?: Array<{
    name: string;
    icon: string;
  }>;
}

const currentRole: Role = {
  title: "Frontend Developer",
  company: "Company Name",
  description: "Building web applications with modern technologies",
  techStack: [
    { name: "React", icon: "react" },
    { name: "TypeScript", icon: "typescript" },
    { name: "Tailwind", icon: "tailwind" }
  ],
  projects: [
    { name: "Project A", icon: "project-a" },
    { name: "Project B", icon: "project-b" }
  ]
}

const sideRoles: Role[] = [
  {
    title: "Open Source Contributor",
    description: "Contributing to web ecosystem",
    techStack: [
      { name: "JavaScript", icon: "javascript" }
    ],
    projects: [
      { name: "Project OSS", icon: "oss" }
    ]
  },
  {
    title: "Technical Writer",
    description: "Sharing web development insights",
    techStack: [
      { name: "Technical Writing", icon: "writing" }
    ]
  }
]

function RoleCard({ role }: { role: Role }) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">
        {role.title}
        {role.company && <span className="text-gray-500"> @ {role.company}</span>}
      </h3>
      <p className="mt-2 text-gray-600">{role.description}</p>

      {role.projects && (
        <div className="mt-3">
          <div className="flex gap-2">
            {role.projects.map(project => (
              <span key={project.name} className="inline-flex items-center">
                {/* Add your icon component here */}
                {project.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {role.techStack.map(tech => (
          <span key={tech.name} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100">
            {/* Add your icon component here */}
            {tech.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Roles({ type = "current" }: { type?: "current" | "side" }) {
  if (type === "current") {
    return <RoleCard role={currentRole} />
  }

  return (
    <div className="flex flex-col gap-4">
      {sideRoles.map((role, index) => (
        <RoleCard key={index} role={role} />
      ))}
    </div>
  )
}