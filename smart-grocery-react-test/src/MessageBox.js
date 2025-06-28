import React from 'react';

const MessageBox = ({ title, content, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
        <p className="text-gray-700 mb-6">{content}</p>
        <button
          className="btn-primary"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default MessageBox;