import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config.js';
import { doc, collection, addDoc, getDocs, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import './UserPage.css'; // Import our custom CSS

function UserPage() {
  const { uid } = useParams(); // Get UID from the route
  const [user, loading, error] = useAuthState(auth);
  const [userName, setUserName] = useState(''); // State for user's name
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileDetails, setFileDetails] = useState({ name: '', url: '' }); // State for file details
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Wait for auth to initialize
    if (error) {
      console.error('Authentication error:', error);
      return;
    }
    if (!user) {
      // User is not logged in, redirect to login page
      navigate('/');
      return;
    }
    if (user.uid !== uid) {
      // User is trying to access someone else's page
      console.error('Unauthorized access attempt');
      navigate('/');
      return;
    }

    // Fetch user's name from Firestore
    const fetchUserName = async () => {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        } else {
          console.log('No user data found.');
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    // Fetch existing files from Firestore
    const fetchUploadedFiles = async () => {
      try {
        const userFilesCollectionRef = collection(db, 'users', uid, 'files');
        const querySnapshot = await getDocs(userFilesCollectionRef);
        const files = querySnapshot.docs.map((doc) => doc.data());
        setUploadedFiles(files);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchUserName();
    fetchUploadedFiles();
  }, [user, loading, error, uid, navigate]);

  // Function to add files using the provided name and URL
  const handleAddFile = async () => {
    if (!fileDetails.name || !fileDetails.url) {
      alert('Please provide both the file name and URL.');
      return;
    }

    try {
      const userFilesCollectionRef = collection(db, 'users', uid, 'files');
      const fileMetadata = {
        name: fileDetails.name,
        url: fileDetails.url,
        uploadedAt: new Date().toISOString(),
      };
      await addDoc(userFilesCollectionRef, fileMetadata);
      setUploadedFiles((prev) => [...prev, fileMetadata]);
      setFileDetails({ name: '', url: '' });
      alert('File added successfully!');
    } catch (error) {
      console.error('Error adding file:', error);
      alert('Failed to add file.');
    }
  };

  return (
    <div className="user-page">
      <h1>Welcome, {userName}!</h1>

      <h2>Add File Metadata</h2>
      <div className="file-form">
        <input
          type="text"
          placeholder="File Name"
          value={fileDetails.name}
          onChange={(e) => setFileDetails({ ...fileDetails, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="File URL"
          value={fileDetails.url}
          onChange={(e) => setFileDetails({ ...fileDetails, url: e.target.value })}
        />
        <button onClick={handleAddFile}>Add File</button>
      </div>

      <h2>Your Uploaded Files:</h2>
      <ul className="file-list">
        {uploadedFiles.map((file, index) => (
          <li key={index}>
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPage;
