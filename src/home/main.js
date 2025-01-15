import React, { useState } from 'react';
import Card from '../components/Cards/card'
import SkillBar from '../components/SkillBar/bar'

export const PageMain = () => {
    const [activeCard, setActiveCard] = useState(null); // Track the active card index

    const handleCardClick = (index) => {
        setActiveCard((prev) => (prev === index ? null : index)); // Toggle or reset the active card
    };

    const cardData = [
        {
            title: 'Reactflow-X-DAG',
            stack: ['JavaScript', 'React', 'Zustand', 'ReactFlow', 'Python', 'FastAPI'],
            desc: 'Sample description',
            video: "/samples/Reactflow.mp4",
            thumbnail: "/thumbnail/Reactflow.png",
            link: 'https://github.com/AbhinavJoe/Reactflow-X-DAG'
        },
        {
            title: 'FinCentrix: AI Powered Financial Advisory',
            stack: ['JavaScript', 'TypeScript', 'Next.js', 'Express', 'ChromaDB', 'Docker', 'Microsoft Azure'],
            desc: 'FinCentrix is an innovative platform that offers personalized financial guidance, transforming how people handle their finances',
            video: "/samples/FinCentrix.mp4",
            thumbnail: "/thumbnail/FinCentrix.png",
            link: 'https://github.com/AbhinavJoe/FinCentrix-A-User-Centric-AI-Financial-Advisor'
        },
        {
            title: 'Google Search Automation',
            stack: ['Python', 'TkinterGUI'],
            desc: 'A simple Python software to automate Google searches.',
            video: "/samples/Google.mp4",
            thumbnail: "/thumbnail/Google.png",
            link: 'https://github.com/AbhinavJoe/Google-Search-Automation'
        },
        {
            title: 'RAG-X-Langchain-JS',
            stack: ['JavaScript', 'Node.js', 'ChromaDB', 'LangchainJS'],
            desc: 'RAGXLangchainJS is a Multi-Doc RAG Application made using JavaScript, Node,js, LangChainJS, and ChromaDB to make your life easier.',
            video: "/samples/RAGXLangchain.mp4",
            thumbnail: "/thumbnail/RAGXLangchain.png",
            link: 'https://github.com/AbhinavJoe/RAG-X-Langchain-JS'
        }
    ]

    return (
        <main className="w-full h-fit container py-8">
            <section className="mb-16">
                <h2 className="font-bold text-2xl mb-8 underline">Languages</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    <SkillBar lang={'JavaScript'} percent={'70'} />
                    <SkillBar lang={'TypeScript'} percent={'70'} />
                    <SkillBar lang={'Python (Flask, FastAPI)'} percent={'50'} />
                    <SkillBar lang={'HTML5, CSS3'} percent={'55'} />
                    <SkillBar lang={'MERN'} percent={'45'} />
                    <SkillBar lang={'Git, GitHub'} percent={'70'} />
                </div>
            </section>
            <section className=''>
                <h2 className="font-bold text-2xl mb-8 underline">Notable Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cardData.map((card, index) => (
                        <Card
                            key={index}
                            {...card}
                            isActive={activeCard === index} // Pass the active state
                            onClick={() => handleCardClick(index)} // Pass the click handler
                        />
                    ))}
                </div>
            </section>
        </main>
    )
}