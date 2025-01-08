import React from 'react';

export const PageHeader = () => {
    return (
        <header className="h-[100vh] w-3/4 m-auto flex items-center">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="w-full md:w-1/2 space-y-6">
                        <span className="text-3xl font-medium">Hello, I'm</span>
                        <h1 className="text-6xl font-bold mb-4 font-serif">Abhinav Joshi</h1>
                        <h2 className="text-3xl mb-6">Web Developer</h2>
                        <p className='text-xl pr-4'>I am passionate about building efficient and scalable solutions. I possess a strong foundation in JavaScript, Python, and Data Structures and Algorithms (DSA), which allows me to tackle complex programming challenges.</p>
                        <p className='text-xl pr-4'>With experience in developing responsive and user-friendly web applications, as well as robust backends, I strive to bring creative, functional, and reliable systems to every project.</p>
                        <a href='#target' className="inline-block border-b-2 border-black text-xl hover:opacity-75 transition-opacity" >
                            Download Resume
                        </a>
                    </div>

                    <div className="w-full md:w-1/2 mt-8 md:mt-0">
                        <div className="aspect-square overflow-hidden mt-8">
                            <img
                                src={require("../assets/img.jpg")}
                                alt="Profile"
                                className="w-full h-full object-cover object-top rounded-l-full border-4 border-black"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};