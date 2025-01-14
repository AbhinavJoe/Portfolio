import Card from '../components/Cards/card'
import SkillBar from '../components/SkillBar/bar'

export const PageMain = () => {
    return (
        <main className="w-full h-fit container px-4 py-16">
            <section className="mb-16">
                <h2 className="font-bold text-2xl mb-8 underline">Languages</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    <SkillBar lang={'JavaScript'} percent={'60'} />
                    <SkillBar lang={'TypeScript'} percent={'60'} />
                    <SkillBar lang={'Python (Flask, FastAPI)'} percent={'50'} />
                    <SkillBar lang={'HTML5, CSS3'} percent={'55'} />
                    <SkillBar lang={'MERN'} percent={'40'} />
                    <SkillBar lang={'Git, GitHub'} percent={'70'} />
                </div>
            </section>

            <section>
                <h2 className="font-bold text-2xl mb-8 underline">Notable Projects</h2>
                <div className="grid grid-cols-2 gap-6">
                    <Card
                        projectTitle={'Reactflow-X-DAG'}
                        projectStack={['JavaScript', 'React', 'Zustand', 'ReactFlow', 'Python', 'FastAPI']}
                        projectDesc={'Sample Description'}
                        projectVideo={"/samples/Reactflow.mp4"}
                        projectThumbnail={"/thumbnail/Reactflow.png"}
                    />
                    <Card
                        projectTitle={'FinCentrix: AI Powered Financial Advisory'}
                        projectStack={['JavaScript', 'TypeScript', 'Next.js', 'Express', 'ChromaDB', 'Docker', 'Microsoft Azure']}
                        projectDesc={'FinCentrix is an innovative platform that offers personalized financial guidance, transforming how people handle their finances'}
                        projectVideo={"/samples/FinCentrix.mp4"}
                        projectThumbnail={"/thumbnail/FinCentrix.png"}
                    />
                    <Card
                        projectTitle={'Google Search Automation'}
                        projectStack={['Python', 'TkinterGUI']}
                        projectDesc={'A simple Python software to automate Google searches.'}
                        projectVideo={"/samples/Google.mp4"}
                        projectThumbnail={"/thumbnail/Google.png"}
                    />
                    <Card
                        projectTitle={'RAG-X-Langchain-JS'}
                        projectStack={['JavaScript', 'Node.js', 'ChromaDB', 'LangchainJS']}
                        projectDesc={'RAGXLangchainJS is a Multi-Doc RAG Application made using JavaScript, Node,js, LangChainJS, and ChromaDB to make your life easier.'}
                        projectVideo={"/samples/RAGXLangchain.mp4"}
                        projectThumbnail={"/thumbnail/RAGXLangchain.png"}
                    />
                </div>
            </section>
        </main>
    )
}