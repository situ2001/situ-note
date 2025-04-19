import Card from "../../components/common/Card";
import type { Role } from "types";

function RoleCard({ role }: { role: Role }) {
  const IconComponent = role.icon && typeof role.icon === 'function' ? role.icon : undefined;

  return (
    <Card>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 rounded-lg">
            {IconComponent ? (
              <IconComponent size={20} className="text-zinc-600 dark:text-zinc-400" />
            ) : typeof role.icon === 'string' ? (
              <img 
                src={role.icon} 
                alt=""
                className="w-6 h-6 object-contain"
              />
            ) : (
              <span className="text-zinc-600 dark:text-zinc-400 text-xl font-medium">
                {role.title[0]}
              </span>
            )}
          </div>
          <h3 className="font-semibold">
            {role.title}
            {role.at && <span className="text-zinc-500 dark:text-zinc-400"> @ {role.at}</span>}
          </h3>
        </div>
      </div>
    </Card>
  )
}

export default RoleCard;
