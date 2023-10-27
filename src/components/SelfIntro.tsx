import Avatar from "../../public/28241963.png";

export const SelfIntro = () => {
  return (
    <div class="flex flex-row">
      <div class="flex-1">
        <h1 class="text-3xl font-bold">Hi!</h1>
        <p>I'm situ2001.</p>
      </div>
      <img
        class="h-16 w-16 rounded-full transition-all duration-300 hover:rotate-180"
        src={Avatar.src}
        alt={"situ2001's GitHub avatar"}
      ></img>
    </div>
  );
};
