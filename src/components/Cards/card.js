import './card.css';

const Card = ({ video, title, stack, desc, thumbnail, isActive, onClick, link }) => {

    return (
        <div className="card container w-full h-[395px]">
            <div className={`content ${isActive ? 'flipped' : ' hover:cursor-pointer'}`}>
                <div className="back">
                    <div className="back-content">
                        <video
                            className="w-full h-full object-cover rounded-xl"
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src={video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <button
                            type='button'
                            className='button absolute bottom-2 right-2 w-fit bg-black text-white hover:bg-purple-300 font-bold'
                            onClick={onClick}
                        >
                            Back to Details
                        </button>
                    </div>
                </div>
                <div className="front">
                    <img src={thumbnail} alt={`${title} thumbnail`} className='img' />
                    <div className="front-content">
                        <div className='flex flex-wrap gap-3'>
                            {stack && stack.map((stackItem, index) => (
                                <small className="badge" key={index}>{stackItem}</small>
                            ))}
                        </div>
                        <div>
                            <div className='flex gap-4 pb-3'>
                                <button
                                    type='button'
                                    className='button w-fit bg-black text-white hover:bg-purple-300 font-bold'
                                    onClick={onClick}
                                >
                                    Play Demo
                                </button>
                                <a
                                    href={link}
                                    target="_blank" // Optional: Opens in a new tab
                                    rel="noopener noreferrer" // Improves security when opening new tabs
                                    className="button w-fit bg-black text-white hover:bg-purple-300 font-bold"
                                >
                                    GitHub
                                </a>

                            </div>
                            <div className="description">
                                <div className="title">
                                    <p className="title">
                                        <strong className=''>{title}</strong>
                                    </p>
                                </div>
                                <p className="card-desc">{desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Card;