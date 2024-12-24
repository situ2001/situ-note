import { EMAIL } from "../../config";

const SelfLinks = () => {
  return (
    <section className="flex flex-wrap flex-col gap-2">
      <header className="text-xl font-bold">
        Contact
      </header>
      <div>
        Send me an <a className="underline" href={`mailto:${EMAIL}`}>email</a>
      </div>
    </section>
  );
};

export default SelfLinks;
