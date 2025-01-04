import Button from "../../components/common/Button";
import RoleCard from "./RoleCard";
import config from "config";
import type { Role } from "types";

const roles = config.roles ?? [];

function Roles({
  roles
}: {
  roles: Role[]
}) {
  if (roles.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Roles</h2>
        {/* <a href="/roles">
          <Button text="More" className="text-sm opacity-50" />
        </a> */}
      </div>

      <div className="flex flex-col gap-4">
        {roles.map((role, index) => (
          <RoleCard key={index} role={role} />
        ))}
      </div>
    </div>
  )
}

const RolesWithProps = () => <Roles roles={roles} />;
export default RolesWithProps;
