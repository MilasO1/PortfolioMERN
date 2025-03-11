import axios from 'axios';

export const getSkills = () => axios.get('/api/skills', { withCredentials: true });

export const createSkill = (data) => {
  const token = localStorage.getItem('token'); // Retrieve the token
  return axios.post('/api/skills/addSkills', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`, // Add the token to the headers
    },
    withCredentials: true,
  });
};

export const deleteSkill = (id) => {
  const token = localStorage.getItem('token'); // Retrieve the token
  return axios.delete(`/api/skills/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Add the token to the headers
    },
    withCredentials: true,
  });
};