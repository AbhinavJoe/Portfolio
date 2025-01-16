import React, { useEffect, useState } from 'react';
import RepoCard from '../../components/RepoCards/repoCard'

const Repo = () => {
    const [repoData, setRepoData] = useState([]);

    const FetchRepos = async () => {
        try {
            const response = await fetch('https://api.github.com/users/AbhinavJoe/repos');
            const repos = await response.json();

            // Map all repositories to the structure we need
            const formattedRepos = repos.map(repo => ({
                name: repo.name,
                url: repo.html_url,
                description: repo.description,
                createdAt: repo.created_at,
                updatedAt: repo.updated_at,
                license: repo.license?.name || 'No License', // Handle cases where license might be null
            })).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by updated date

            setRepoData(formattedRepos);
        } catch (error) {
            console.error('Error fetching repositories:', error);
        }
    }

    useEffect(() => {
        FetchRepos();
    }, []);

    return (
        <div className='h-full w-full border-[3px] border-black rounded-xl overflow-y-scroll'>
            <div className='flex flex-col gap-2'>
                {repoData.map((repo, index) => (
                    <RepoCard
                        key={repo.name} // Using repo name as key is better than index
                        name={repo.name}
                        url={repo.url}
                        desc={repo.description}
                        licence={repo.license}
                        createDate={repo.createdAt}
                        lastUpdate={repo.updatedAt}
                    />
                ))}
            </div>
        </div>
    );
}

export default Repo;