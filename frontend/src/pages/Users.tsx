import React, { useState, useEffect } from 'react';
import { UserManagement } from '../components/UserManagement';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';

// HUMAN ASSISTANCE NEEDED
// The following component may need additional error handling, loading states, and optimization for production readiness.
const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        // TODO: Implement proper error handling
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async (userData: any) => {
    try {
      const newUser = await createUser(userData);
      setUsers([...users, newUser]);
    } catch (error) {
      console.error('Error creating user:', error);
      // TODO: Implement proper error handling
    }
  };

  const handleUpdateUser = async (userId: string, userData: any) => {
    try {
      const updatedUser = await updateUser(userId, userData);
      setUsers(users.map(user => user.id === userId ? updatedUser : user));
    } catch (error) {
      console.error('Error updating user:', error);
      // TODO: Implement proper error handling
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      // TODO: Implement proper error handling
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <UserManagement
        users={users}
        onCreateUser={handleCreateUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default Users;