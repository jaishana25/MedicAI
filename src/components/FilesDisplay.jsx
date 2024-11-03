import React from 'react';

function FilesDisplay({ currentUser, files }) {

  const userFiles = files.filter(file => file.user === currentUser);

  return (
    <div>
      <h3>Your Uploaded Files</h3>
      {userFiles.length > 0 ? (
        <ul>
          {userFiles.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      ) : (
        <p>No files uploaded.</p>
      )}
    </div>
  );
}

export default FilesDisplay;
