import React, { useState } from 'react';

function FileUpload({ currentUser, files, setFiles }) {
  const [fileInput, setFileInput] = useState(null);

  const handleFileChange = (e) => {
    setFileInput(e.target.files[0]);
  };

  const handleUpload = () => {
    if (fileInput) {

      const newFile = {
        name: fileInput.name,
        user: currentUser
      };
      setFiles(prevFiles => [...prevFiles, newFile]);
      setFileInput(null);
    }
  };

  return (
    <div>
      <h3>Upload File</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default FileUpload;
