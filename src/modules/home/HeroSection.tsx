import LinkButton from "../../components/IconLink";
import config from "config";

const { contacts: links, description } = config.hero;

export default function AboutMe() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold">situ2001</h1>
      <div>
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
      <div>
        <Contact />
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="flex gap-4 flex-row">
      {links.map((link) => (
        <div key={link.name}>
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
