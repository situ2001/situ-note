import Button from "./Button"

const More = ({ href }: { href: string; }) => {
  return <a href={href}>
    <Button text="More" className="text-sm opacity-50 cursor-pointer" />
  </a>
}

export default More;
