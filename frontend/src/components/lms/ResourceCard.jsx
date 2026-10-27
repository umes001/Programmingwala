import React from 'react';
import { Download, ExternalLink, FileText, Image, Video, File } from 'lucide-react';

const ResourceCard = ({ icon, title, type, size, downloadUrl }) => {
  const getFileIcon = (fileType) => {
    const typeLower = fileType?.toLowerCase() || '';
    
    if (typeLower.includes('pdf')) {
      return <FileText className="w-4 h-4 text-red-500" />;
    } else if (typeLower.includes('image') || typeLower.includes('jpg') || typeLower.includes('png')) {
      return <Image className="w-4 h-4 text-green-500" />;
    } else if (typeLower.includes('video') || typeLower.includes('mp4') || typeLower.includes('mov')) {
      return <Video className="w-4 h-4 text-blue-500" />;
    } else if (typeLower.includes('zip') || typeLower.includes('rar')) {
      return <File className="w-4 h-4 text-purple-500" />;
    } else {
      return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = title || 'resource';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePreview = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center">
        {/* File Icon */}
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm">
          {icon || getFileIcon(type)}
        </div>
        
        {/* File Info */}
        <div>
          <h4 className="font-medium text-gray-900 text-sm mb-1">
            {title}
          </h4>
          <div className="flex items-center text-xs text-gray-500">
            {type && (
              <span className="px-2 py-0.5 bg-gray-200 rounded mr-2">
                {type.toUpperCase()}
              </span>
            )}
            {size && <span>{size}</span>}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        {downloadUrl && (
          <>
            <button
              onClick={handlePreview}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
              title="Preview"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-white rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;