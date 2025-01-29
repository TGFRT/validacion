// components/UserPhotos.js
import { useEffect, useState } from 'react';

const UserPhotos = ({ phone }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const response = await fetch(`/api/getUserPhotos?phone=${phone}`);
      const data = await response.json();
      setPhotos(data.photos || []);
    };

    fetchPhotos();
  }, [phone]);

  return (
    <div>
      <h3>User Photos</h3>
      {photos.length > 0 ? (
        <div>
          {photos.map((photo) => (
            <div key={photo.type}>
              <h4>{photo.type}</h4>
              <img src={photo.url} alt={photo.type} style={{ maxWidth: '100%' }} />
            </div>
          ))}
        </div>
      ) : (
        <p>No photos found</p>
      )}
    </div>
  );
};

export default UserPhotos;
