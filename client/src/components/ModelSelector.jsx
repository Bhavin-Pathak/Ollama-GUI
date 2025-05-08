import React from 'react';
import { ChevronDown } from 'lucide-react';

export const ModelSelector = ({ models, selectedModel, onSelectModel }) => {
  return (
    <div className="relative inline-block text-left">
      <div>
        <button 
          type="button" 
          className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          id="model-menu"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {selectedModel || 'Select Model'}
          <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="model-menu">
          {models.map((model) => (
            <button
              key={model.name}
              className={`block w-full text-left px-4 py-2 text-sm ${
                selectedModel === model.name ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } hover:bg-gray-100`}
              role="menuitem"
              onClick={() => onSelectModel(model.name)}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};