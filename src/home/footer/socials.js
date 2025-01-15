import { FaGithub, FaLinkedin } from "react-icons/fa6";

const Socials = () => {
    return (
        <div className="flex gap-4 text-2xl font-bold items-center justify-center md:justify-start">
            <span>Some Links:</span>
            <FaLinkedin className="hover:cursor-pointer" />
            <FaGithub className="hover:cursor-pointer" />
        </div>
    )
}

export default Socials;