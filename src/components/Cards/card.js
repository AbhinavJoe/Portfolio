import './card.css';

const Card = ({ projectVideo, projectTitle, projectStack, projectDesc, projectThumbnail }) => {
    return (
        <div className="card container w-full h-[385px]">
            <div className="content">
                <div className="back">
                    <div className="back-content">
                        <video
                            className="w-full h-full object-cover rounded-md"
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src={projectVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
                <div className="front">
                    <img src={projectThumbnail} alt={`${projectTitle} Thumbnail`} className='img' />
                    <div className="front-content">
                        <div className='flex flex-wrap gap-3'>
                            {projectStack && projectStack.map((stackItem, index) => (
                                <small className="badge" key={index}>{stackItem}</small>
                            ))}
                        </div>
                        <div className="description">
                            <div className="title">
                                <p className="title">
                                    <strong className=''>{projectTitle}</strong>
                                </p>
                                <svg
                                    style={{
                                        fillRule: "nonzero",
                                        height: "15px",
                                        width: "15px",
                                        viewBox: "0 0 256 256",
                                        xmlns: "http://www.w3.org/2000/svg"
                                    }}
                                >
                                    <g style={{ mixBlendMode: 'normal', textAnchor: "none", fontSize: "none", fontWeight: "none", fontFamily: "none", strokeDashoffset: "0", strokeDasharray: "", strokeMiterlimit: "10", strokeLinejoin: "miter", strokeLinecap: "butt", strokeWidth: "1", stroke: "none", fillRule: "nonzero", fill: "#20c997" }}>
                                        <g style={{ transform: "scale(8,8)" }}>
                                            <path d="M25,27l-9,-6.75l-9,6.75v-23h18z"></path>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <p className="card-desc">{projectDesc}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;