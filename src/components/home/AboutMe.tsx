import links from "../../config/links";
import LinkButton from "../IconLink";

export default function AboutMe() {
  return (
    <section className="flex flex-col h-full gap-2">
      <div>
        <h1 className="text-3xl font-bold mb-2">Hi,</h1>
        <h1 className="text-2xl font-bold mb-2">I am situ2001.</h1>
      </div>

      <div>
        <p>A software developer.</p>
      </div>

      <div className="my-1"></div>

      <div className="flex gap-4 flex-row">
        {links.map((link) => (
          <LinkButton
            key={link.name}
            icon={link.icon}
            link={link.link}
            name={link.name}
            hideText
            size="larger"
          />
        ))}
      </div>
    </section>
  );
}
