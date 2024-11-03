import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, TextField, MenuItem,
  Select, InputLabel, FormControl, Paper, List, ListItem,
  ListItemText, Divider, Box, IconButton, Snackbar
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useDropzone } from 'react-dropzone';
import { Delete, Visibility } from '@mui/icons-material';

function ReportAnalysis({ username }) {
  const [treatments, setTreatments] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploadDate, setUploadDate] = useState(null);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTreatment, setNewTreatment] = useState('');
  const [showNewTreatmentInput, setShowNewTreatmentInput] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const onDrop = (acceptedFiles) => {
    const pdfFile = acceptedFiles[0];
    setFile(pdfFile);
    setFileName(pdfFile.name);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'application/pdf',
  });

  useEffect(() => {
    
    const savedReports = JSON.parse(localStorage.getItem('userReports')) || [];
    const userReports = savedReports.filter(report => report.username === username); 
    setFilteredReports(userReports); 

    const savedTreatments = JSON.parse(localStorage.getItem('userTreatments')) || [];
    const userTreatments = savedTreatments.filter(treatment => treatment.username === username);
    setTreatments(userTreatments);
  }, [username]);

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleDateChange = (date) => {
    setUploadDate(date);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
  
    if (value) {
      setSelectedTreatment(value);
    } else {
      setSelectedTreatment('');
    }
    setShowNewTreatmentInput(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      setSnackbarMessage('Please upload a PDF file.');
      setSnackbarOpen(true);
      return;
    }

    const newReport = {
      id: reports.length + 1,
      username, 
      fileName: fileName || (file ? file.name : 'Unnamed File'),
      treatment: selectedTreatment,
      uploadDate: uploadDate ? uploadDate.toLocaleDateString() : new Date().toLocaleDateString(),
      fileUrl: URL.createObjectURL(file),
    };

    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    setFilteredReports(updatedReports);
    localStorage.setItem('userReports', JSON.stringify(updatedReports)); 
    setFileName('');
    setSelectedTreatment('');
    setUploadDate(null);
    setSearchTerm('');
    setNewTreatment('');
    setShowNewTreatmentInput(false);
    setShowDropdown(false);
    setSnackbarMessage('Report submitted successfully!');
    setSnackbarOpen(true);
  };

  const handleFilterChange = (event) => {
    const selectedTreatment = event.target.value;
    setSelectedTreatment(selectedTreatment);
    if (selectedTreatment) {
      const filtered = reports.filter(report => report.treatment === selectedTreatment);
      setFilteredReports(filtered);
    } else {
      setFilteredReports(reports); 
    }
  };

  const handleCreateNewTreatment = () => {
    if (newTreatment.trim() && !treatments.some(t => t.name === newTreatment.trim())) {
      const newTreatmentObj = { id: treatments.length + 1, name: newTreatment.trim(), username }; 
      const updatedTreatments = [...treatments, newTreatmentObj];
      setTreatments(updatedTreatments);
      localStorage.setItem('userTreatments', JSON.stringify(updatedTreatments));
      setSelectedTreatment(newTreatment.trim());
      setNewTreatment('');
      setShowNewTreatmentInput(false);
      setSearchTerm(newTreatment.trim());
      setShowDropdown(false);
    
      const filtered = reports.filter(report => report.treatment === newTreatment.trim());
      setFilteredReports(filtered.length > 0 ? filtered : reports);
    } else if (treatments.some(t => t.name === newTreatment.trim())) {
      setSnackbarMessage('Treatment already exists!');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteReport = (id) => {
    const updatedReports = reports.filter(report => report.id !== id);
    setReports(updatedReports);
    setFilteredReports(updatedReports);
    localStorage.setItem('userReports', JSON.stringify(updatedReports));
    setSnackbarMessage('Report deleted successfully!');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const filteredTreatments = [...treatments, { name: newTreatment }].filter(treatment =>
    treatment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>Report Analysis</Typography>
      <Paper sx={{ p: 3, mb: 5 }}>
        <form onSubmit={handleSubmit}>
          <Box
            {...getRootProps()}
            sx={{
              p: 3,
              border: '2px dashed #aaa',
              borderRadius: '4px',
              mb: 2,
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <input {...getInputProps()} />
            <Typography>Drag and drop a PDF file here, or click to select a file</Typography>
          </Box>
          <TextField
            label="File Name"
            value={fileName}
            onChange={handleFileNameChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Search or Enter Treatment"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for a treatment..."
            fullWidth
            sx={{ mb: 2 }}
          />
          {showDropdown && (
            <Paper sx={{ maxHeight: 150, overflow: 'auto', mb: 2 }}>
              {filteredTreatments.length ? (
                filteredTreatments.map(treatment => (
                  <ListItem
                    button
                    key={treatment.id || treatment.name}
                    onClick={() => {
                      setSelectedTreatment(treatment.name);
                      setSearchTerm(treatment.name);
                      setShowNewTreatmentInput(false);
                      setShowDropdown(false);
                    }}
                  >
                    <ListItemText primary={treatment.name} />
                  </ListItem>
                ))
              ) : (
                <ListItem
                  button
                  onClick={() => {
                    setShowNewTreatmentInput(true);
                    setNewTreatment('');
                    setSearchTerm('');
                    setSelectedTreatment('');
                    setShowDropdown(false);
                  }}
                >
                  <ListItemText primary="Other" />
                </ListItem>
              )}
            </Paper>
          )}
          {showNewTreatmentInput && (
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Enter New Treatment"
                value={newTreatment}
                onChange={(e) => setNewTreatment(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleCreateNewTreatment}>
                Add
              </Button>
            </Box>
          )}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Upload Date"
              value={uploadDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
              sx={{ mb: 2 }}
            />
          </LocalizationProvider>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
            Submit Report
          </Button>
        </form>
      </Paper>
      <Typography variant="h5" gutterBottom>Your Reports</Typography>
      <span> Filter by Treatment </span>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="treatment-select-label"> </InputLabel>
        <Select
          labelId="treatment-select-label"
          value={selectedTreatment}
          onChange={handleFilterChange}
          displayEmpty
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {treatments.map(treatment => (
            <MenuItem key={treatment.id} value={treatment.name}>
              {treatment.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <List>
        {filteredReports.map(report => (
          <div key={report.id}>
            <ListItem>
              <ListItemText primary={report.fileName} secondary={`Treatment: ${report.treatment} | Date: ${report.uploadDate}`} />
              <IconButton onClick={() => handleDeleteReport(report.id)}>
                <Delete />
              </IconButton>
              <IconButton href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                <Visibility />
              </IconButton>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
}

export default ReportAnalysis;
