import LinkButton from "../../components/IconLink";
import config from "config";

const { contacts: links, description } = config.hero;

export default function AboutMe() {
  return (
    <div className="">
      <div className="my-5">
        <h1 className="text-3xl font-bold">situ2001</h1>
      </div>

      <div className="my-5">
        {
          Array.isArray(description)
            ?
            description.map((desc, index) => (
              <p key={index}>{desc}</p>
            ))
            :
            <p>{description}</p>
        }
      </div>

      <div className="my-5">
        <Contact />
      </div>
    </div>
  );
}

function Contact(props: {
  onHoverChange?: (name: string) => void;
}) {
  return (
    <div className="flex gap-4 flex-row">
      {links.map((link) => (
        <div
          key={link.name}
          onPointerEnter={() => props.onHoverChange?.(link.name)}
          onPointerLeave={() => props.onHoverChange?.("")}
        >
          <LinkButton
            icon={link.icon}
            link={link.link}
            name={link.name}
            hideText
            size="lg"
          />
        </div>
      ))}
    </div>
  )
}