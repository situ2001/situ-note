import Button from "../common/Button";

type InfoTag = {
  name: string;
}

interface Role {
  title: string;
  company?: string;
  infoTags: InfoTag[];
}

const currentRole: Role = {
  title: "Web Dev",
  company: "TME",
  infoTags: [
    { name: "JavaScript" },
    { name: "React" },
    { name: "CI/CD" },
    { name: "Ops" },
  ],
}

const sideRoles: Role[] = [
  {
    title: "Open Source Contributor",
    infoTags: [
      { name: "JavaScript" },
      { name: "Rust" }
    ],
  },
  {
    title: "Writer",
    infoTags: [
      { name: "Blogging" },
      { name: "PKM" },
      { name: "Technical Writing" },
    ]
  }
]

function InfoTagComponent({ tag }: { tag: InfoTag }) {
  return (
    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
      {tag.name}
    </span>
  );
}

function RoleCard({ role }: { role: Role }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
            <span className="text-gray-600 text-xl font-medium">
              {role.title[0]}
            </span>
          </div>
          <h3 className="font-semibold">
            {role.title}
            {role.company && <span className="text-gray-500"> @ {role.company}</span>}
          </h3>
        </div>

        {/* <div className="flex flex-wrap gap-2 mt-auto">
          {role.infoTags.map(tag => (
            <InfoTagComponent key={tag.name} tag={tag} />
          ))}
        </div> */}
      </div>
    </div>
  )
}

export default function Roles({ type = "current" }: { type?: "current" | "side" }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        {/* TODO pick one of theme */}
        <h2 className="text-xl font-medium">Roles</h2>
        {/* <h2 className="text-gray-500 text-sm font-medium mb-2">Roles</h2> */}
        <a href="/projects">
          <Button text="More" className="text-sm opacity-50" />
        </a>
      </div>


      <div className="flex flex-col gap-4">
        {/* TODO merge roles */}
        <RoleCard role={currentRole} />
        {sideRoles.map((role, index) => (
          <RoleCard key={index} role={role} />
        ))}
      </div>
    </div>
  )
}
