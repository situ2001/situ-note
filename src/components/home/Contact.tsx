import { EMAIL } from "../../config";
import links from "../../config/links";
import LinkButton from "../IconLink";

const SelfLinks = () => {
  return (
    <section className="flex flex-wrap flex-col gap-2">
      <header className="text-xl font-bold">
        Contact
      </header>
      <div>
        Send me an <a className="underline" href={`mailto:${EMAIL}`}>email</a> or find me on:
      </div>
      <div className="flex gap-2 md:gap-4 flex-col md:flex-row">
        {links.map((link) => (
          <LinkButton
            key={link.name}
            icon={link.icon}
            link={link.link}
            name={link.name}
          />
        ))}
      </div>
    </section>
  );
};

export default SelfLinks;
