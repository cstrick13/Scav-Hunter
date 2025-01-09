import { useParams } from 'react-router-dom';

function UserPage() {
  const { uid } = useParams(); // Extract the UID from the URL

  return (
    <div>
      <h1>Welcome to your page!</h1>
      <p>Your UID: {uid}</p>
    </div>
  );
}

export default UserPage;
