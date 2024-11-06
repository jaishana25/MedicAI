import { Delete, Visibility } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List, ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

function ReportAnalysis({ username }) {
  const [treatments, setTreatments] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [uploadTreatment, setUploadTreatment] = useState('');
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

  const user = "admin"
  const password = "abcd@1234"

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

    const fetchTreatments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/report-analysis/treatments', {
          auth: {
            "username": user,
            "password": password,
          },
        });
        setTreatments(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching treatments:', error);
      }
    };
    fetchTreatments()

    const savedReports = JSON.parse(localStorage.getItem('userReports')) || [];
    const userReports = savedReports.filter(report => report.username === username);
    setFilteredReports(userReports);

    const savedTreatments = JSON.parse(localStorage.getItem('userTreatments')) || [];
    const userTreatments = savedTreatments.filter(treatment => treatment.username === username);
    setTreatments(userTreatments);
  }, [user]);

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
      setUploadTreatment(value);
    } else {
      setUploadTreatment('');
    }
    setShowNewTreatmentInput(false);
  };

  const uploadReport = async (newReport) => {
    try {
      const formData = new FormData();
      formData.append('name', newReport.name);
      formData.append('file', newReport.file);
      if (newReport.date != null) formData.append('date', newReport.date);
      if (newReport.treatment != '') formData.append('treatment', newReport.treatment);
      console.log(formData);


      const response = await axios.post('http://127.0.0.1:8000/report-analysis/reports/upload/', formData, {
        auth: {
          username: user,
          password: password,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackbarMessage('Report uploaded successfully!');
      setSnackbarOpen(true);
      return response.data;
    } catch (error) {
      console.error('Error uploading report:', error);
      setSnackbarMessage('Failed to upload report.');
      setSnackbarOpen(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setSnackbarMessage('Please upload a PDF file.');
      setSnackbarOpen(true);
      return;
    }

    const newReport = {
      name: fileName || file.name,
      file: file,
      date: uploadDate ? uploadDate.toISOString().split('T')[0] : null,
      treatment: uploadTreatment,
    };

    // Call uploadReport function to send data to the server
    await uploadReport(newReport);

    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    setFileName('');
    setUploadTreatment('');
    setUploadDate(null);
    setFile(null);
    setSearchTerm('');
    setNewTreatment('');
    setShowNewTreatmentInput(false);
    setSnackbarMessage('');
    setShowDropdown(false);
  };

  const fetchReports = async (treatmentId) => {

    const url = treatmentId
      ? `http://127.0.0.1:8000/report-analysis/reports/list/treatment/${treatmentId}`
      : `http://127.0.0.1:8000/report-analysis/reports/list/`; // Fetch all if no treatmentId
    try {
      const response = await axios.get(url, {
        auth: {
          username: user,
          password: password,
        },
      });
      console.log(response.data)
      setFilteredReports(response.data.medical_reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setSnackbarMessage('Failed to fetch reports.');
      setSnackbarOpen(true);
    }
  };

  const handleFilterChange = async (event) => {
    const treatmentId = event.target.value;
    setSelectedTreatment(treatmentId);
    console.log(treatmentId)

    if (treatmentId) {
      // Fetch reports for the selected treatment
      await fetchReports(treatmentId);
    } else {
      // Fetch all reports when "All" is selected
      await fetchReports(); // Updated to call fetchReports with no arguments
    }
  };

  // const handleFilterChange = (event) => {
  //   const selectedTreatment = event.target.value;
  //   setSelectedTreatment(selectedTreatment);
  //   if (selectedTreatment) {
  //     const filtered = reports.filter(report => report.treatment === selectedTreatment);
  //     setFilteredReports(filtered);
  //   } else {
  //     setFilteredReports(reports);
  //   }
  // };

  // NEW: Function to create a new treatment via API
  const createTreatment = async (treatmentName) => {
    try {
      await axios.post('http://127.0.0.1:8000/report-analysis/treatments', { name: treatmentName }, {
        auth: {
          "username": user,
          "password": password,
        },
      });
      setSnackbarMessage('Treatment created successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error creating treatment:', error);
      setSnackbarMessage('Failed to create treatment.');
      setSnackbarOpen(true);
    }
  };

  const handleCreateNewTreatment = async () => {
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

      // NEW: Call the function to create a new treatment via API
      await createTreatment(newTreatment.trim());

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
            <MenuItem key={treatment.id} value={treatment.name}> {/* Use treatment.id here */}
              {treatment.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <List>
        {filteredReports.length > 0 ? (
          filteredReports.map(report => (
            <div key={report.id}>
              <ListItem>
                <ListItemText primary={report.name} secondary={`Treatment: ${report.treatment} | Date: ${report.test_date}`} />
                <IconButton onClick={() => handleDeleteReport(report.id)}>
                  <Delete />
                </IconButton>
                <IconButton href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Visibility />
                </IconButton>
              </ListItem>
              <Divider />
            </div>
          ))
        ) : (
          <ListItem>
            <ListItemText primary={`No reports for ${`the treatment: ${selectedTreatment}` || 'this treatment'}`} />
          </ListItem>
        )}
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
