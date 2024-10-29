export default function AboutMe() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">Hi!</h1>
          <p>I'm situ2001, a software developer.</p>
        </div>
        {/* <img
          src="/avatar.png"
          loading="lazy"
          alt={"situ2001's GitHub avatar"}
          className="h-16 w-16 rounded-full transition-transform duration-300 hover:rotate-180"
          width="100"
          height="100"
        /> */}
        {/* <div className="opacity-50">
          Site is Under Construction
        </div> */}
      </div>
      <div className="my-1"></div>
    </div>
  );
}
