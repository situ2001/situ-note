import links from "../../config/links";
import LinkButton from "../IconLink";

export default function AboutMe() {
  return (
    <section className="flex flex-col h-full">
      <div className="flex flex-row">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">Hi!</h1>
          <p>I'm situ2001, a software developer.</p>
        </div>
      </div>
      <div className="my-1"></div>
      <div className="flex gap-2 md:gap-4 flex-row">
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
