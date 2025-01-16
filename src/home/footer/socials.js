import { FaGithub, FaLinkedin } from "react-icons/fa6";

const Socials = () => {
    return (
        <div className="flex gap-4 text-2xl font-bold items-center justify-center md:justify-start">
            <span>Some Links:</span>
            <FaLinkedin className="hover:cursor-pointer" onClick={() => window.open('https://www.linkedin.com/in/abhinavjoe/', '_blank', 'noopener,noreferrer')} />
            <FaGithub className="hover:cursor-pointer" onClick={() => window.open('https://github.com/abhinavjoe', '_blank', 'noopener,noreferrer')} />
        </div>
    )
}

export default Socials;