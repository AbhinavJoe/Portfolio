import React from 'react';

export const PageHeader = () => {
    return (
        <header className="h-fit md:h-screen w-full flex items-center container px-4 py-8 md:py-0">
            <div className="flex flex-col md:flex-row md:items-center">
                <div className="w-full  md:w-1/2 space-y-6 order-2">
                    <div className='text-center md:text-left space-y-6'>
                        <span className=" text-2xl md:text-3xl font-medium">Hello, I'm</span>
                        <h1 className="text-3xl md:text-6xl font-bold mb-4 font-serif">Abhinav Joshi</h1>
                    </div>
                    <p className='text-lg md:text-xl text-justify md:pr-6'>I am passionate about building efficient and scalable solutions. I possess a strong foundation in JavaScript, Python, and Data Structures and Algorithms (DSA), which allows me to tackle complex challenges.</p>
                    <p className='text-lg md:text-xl text-justify md:pr-6'>With experience in developing responsive and user-friendly web applications, as well as robust backends, I strive to bring creative, functional, and reliable systems to every project.</p>
                    {/* <a href='#target' className="inline-block border-b-2 border-black text-xl hover:opacity-75 transition-opacity" >
                        Download Resume
                    </a> */}
                </div>
                <div className="w-full md:w-1/2 pb-8 md:pb-0 md:order-2">
                    <div className="aspect-square overflow-hidden mt-8">
                        <img
                            src={require("../assets/images/img.jpg")}
                            alt="Abhinav Joshi"
                            className="w-full h-full object-cover object-top rounded-full border-4 border-black"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};