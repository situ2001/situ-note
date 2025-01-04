import Button from "../../components/common/Button";

import config from "config";
import type { Role } from "types";
const roles = config.roles ?? [];

function RoleCard({ role }: { role: Role }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-600 dark:text-gray-400 text-xl font-medium">
              {role.title[0]}
            </span>
          </div>
          <h3 className="font-semibold">
            {role.title}
            {role.at && <span className="text-gray-500 dark:text-gray-400"> @ {role.at}</span>}
          </h3>
        </div>
      </div>
    </div>
  )
}

function Roles({
  roles
}: {
  roles: Role[]
}) {
  if (roles.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        {/* TODO pick one of theme */}
        <h2 className="text-xl font-medium">Roles</h2>
        {/* <h2 className="text-gray-500 text-sm font-medium mb-2">Roles</h2> */}
        <a href="/roles">
          <Button text="More" className="text-sm opacity-50" />
        </a>
      </div>


      <div className="flex flex-col gap-4">
        {/* TODO merge roles */}
        {roles.map((role, index) => (
          <RoleCard key={index} role={role} />
        ))}
      </div>
    </div>
  )
}

const RolesWithProps = () => <Roles roles={roles} />;
export default RolesWithProps;
