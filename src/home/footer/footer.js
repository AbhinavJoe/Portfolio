import React from 'react';
import Repo from './repo';
import Form from './form';
import Socials from './socials'

const PageFooter = () => {
    return (
        <footer className="w-full h-screen flex flex-col justify-between items-center md:flex-row gap-16 container">
            <section className='w-full md:w-[45%] h-[70vh] flex flex-col justify-between gap-8 md:gap-0 order-2'>
                <Form />
                <Socials />
            </section>
            <section className='w-full h-[80vh] md:w-[60%] md:h-[70vh] py-14 md:py-0'>
                <span className='font-bold text-2xl'>GitHub Repositories</span>
                <Repo />
            </section>
        </footer>
    );
};

export default PageFooter;