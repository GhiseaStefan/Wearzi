import { useEffect, useState } from 'react';

import fetchUsers from '../../App/generalFunctions/fetchUsers';
import ViewSingleUser from './ViewSingleUser';
import './ViewUsers.css'

const ViewUsers = () => {
  const SERVER = 'http://localhost:8123';
  const [users, setUsers] = useState({});

  useEffect(() => {
    fetchUsers().then(u => setUsers(u));
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`${SERVER}/user/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(prevUsers => {
        const updatedUsers = { ...prevUsers };
        delete updatedUsers[userId];
        return updatedUsers;
      });
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <div className='ViewUsers'>
      {Object.values(users).map(u => (
        <ViewSingleUser key={u._id} user={u} handleDelete={handleDelete} />
      ))}
    </div>
  )
}

export default ViewUsers