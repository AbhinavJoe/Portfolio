import React from 'react';
import { BiLinkExternal } from "react-icons/bi";


const RepoCard = ({ name, url, desc, licence, createDate }) => {
    // Format date to be more readable
    const formattedDate = new Date(createDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-purple-100">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-purple-900 hover:text-purple-700 transition-colors">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        {name}
                        <BiLinkExternal className="w-4 h-4" />
                    </a>
                </h3>
                {/* <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-gray-600">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">0</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                        <GitFork className="w-4 h-4" />
                        <span className="text-sm">0</span>
                    </div>
                </div> */}
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{desc || 'No description available'}</p>

            <div className="flex flex-wrap gap-3 items-center text-sm text-gray-500">
                {licence && (
                    <span className="bg-purple-50 px-3 py-1 rounded-full">
                        {licence}
                    </span>
                )}
                <span className="bg-purple-50 px-3 py-1 rounded-full">
                    Created: {formattedDate}
                </span>
            </div>
        </div>
    );
};

export default RepoCard;