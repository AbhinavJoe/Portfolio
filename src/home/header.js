import React from 'react';

export const PageHeader = () => {
    return (
        <header className="h-fit md:h-[100vh] w-full flex items-center container px-4 py-8 md:py-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="w-full md:w-1/2 space-y-6 order-2">
                    <span className="text-3xl font-medium">Hello, I'm</span>
                    <h1 className="text-6xl font-bold mb-4 font-serif">Abhinav Joshi</h1>
                    <h2 className="text-3xl mb-6">Web Developer</h2>
                    <p className='text-xl pr-4'>I am passionate about building efficient and scalable solutions. I possess a strong foundation in JavaScript, Python, and Data Structures and Algorithms (DSA), which allows me to tackle complex programming challenges.</p>
                    <p className='text-xl pr-4'>With experience in developing responsive and user-friendly web applications, as well as robust backends, I strive to bring creative, functional, and reliable systems to every project.</p>
                    {/* <a href='#target' className="inline-block border-b-2 border-black text-xl hover:opacity-75 transition-opacity" >
                        Download Resume
                    </a> */}
                </div>
                <div className="w-full md:w-1/2 pb-8 md:pb-0 md:order-2">
                    <div className="aspect-square overflow-hidden mt-8">
                        <img
                            src={require("../assets/images/img.jpg")}
                            alt="Profile"
                            className="w-full h-full object-cover object-top rounded-full border-4 border-black"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};