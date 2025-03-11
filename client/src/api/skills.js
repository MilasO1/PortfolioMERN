import axios from 'axios';

export const getSkills = () => axios.get('/api/skills', { withCredentials: true });
export const createSkill = (data) => axios.post('/api/skills/addSkills', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
  withCredentials: true
});
export const deleteSkill = (id) => axios.delete(`/api/skills/${id}`, { withCredentials: true });