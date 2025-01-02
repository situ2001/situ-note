import type { ReactNode } from 'react'

type InfoTag = {
  name: string;
}

interface Role {
  title: string;
  company?: string;
  infoTags: InfoTag[];
  projects?: Array<{
    name: string;
    icon: string;
  }>;
}

const currentRole: Role = {
  title: "Frontend Developer",
  company: "Company Name",
  infoTags: [
    { name: "React" },
    { name: "TypeScript" },
    { name: "Tailwind" }
  ],
  projects: [
    { name: "Project A", icon: "project-a" },
    { name: "Project B", icon: "project-b" }
  ]
}

const sideRoles: Role[] = [
  {
    title: "Open Source Contributor",
    infoTags: [
      { name: "JavaScript" }
    ],
    projects: [
      { name: "Project OSS", icon: "oss" }
    ]
  },
  {
    title: "Technical Writer",
    infoTags: [
      { name: "Technical Writing" }
    ]
  }
]

function InfoTagComponent({ tag }: { tag: InfoTag }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100">
      {tag.name}
    </span>
  );
}

function RoleCard({ role }: { role: Role }) {
  return (
    <div>
      <h3 className="text-base font-semibold">
        {role.title}
        {role.company && <span className="text-gray-500"> @ {role.company}</span>}
      </h3>

      {role.projects && (
        <div className="mt-2">
          <div className="flex gap-1">
            {role.projects.map(project => (
              <span key={project.name} className="inline-flex items-center text-sm">
                {project.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-1">
        {role.infoTags.map(tag => (
          <InfoTagComponent key={tag.name} tag={tag} />
        ))}
      </div>
    </div>
  )
}

export default function Roles({ type = "current" }: { type?: "current" | "side" }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-3 border rounded-lg">
        <h2 className="text-gray-500 text-sm font-medium mb-2">Current</h2>
        <RoleCard role={currentRole} />
      </div>

      <div className='p-3 border rounded-lg'>
        <h2 className="text-gray-500 text-sm font-medium mb-2">Side</h2>
        <div className="flex flex-col">
          {sideRoles.map((role, index) => (
            <div key={index}>
              <RoleCard role={role} />
              {index < sideRoles.length - 1 && (
                <hr className="my-4 mx-2 border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}