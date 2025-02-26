# PortfolioMERN

/api/skills.js : 
import axios from 'axios';

export const getSkills = () => axios.get('/api/skills', { withCredentials: true });
export const createSkill = (data) => axios.post('/api/skills/addSkills', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
  withCredentials: true
});
export const deleteSkill = (id) => axios.delete(`/api/skills/${id}`, { withCredentials: true }); 

/components/SkillForm.jsx : 
import { useState } from 'react';
import axios from 'axios';

export default function SkillForm({ onSuccess, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    category: '',
    level: 'Beginner',
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('level', formData.level);
    if (formData.image) data.append('imageUrl', formData.image);

    try {
      const endpoint = initialData 
        ? `/api/skills/${initialData._id}`
        : '/api/skills/addSkills';
      const method = initialData ? 'put' : 'post';
      
      const { data: result } = await axios[method](endpoint, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      onSuccess(result.skill);
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <select
        value={formData.level}
        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
        className="w-full p-2 border rounded"
      >
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Expert">Expert</option>
      </select>
      <input
        type="file"
        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 text-white bg-primary rounded hover:bg-secondary"
      >
        {initialData ? 'Update Skill' : 'Add Skill'}
      </button>
    </form>
  );
} 

/context/AuthContext.jsx :
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get('/api/users/me', { withCredentials: true });
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/users/login', { email, password }, { withCredentials: true });
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post('/api/users/register', { name, email, password });
    setUser(data.user);
  };

  const logout = async () => {
    await axios.post('/api/users/logout', {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 

/pages/Dashboard.jsx : 
import { useEffect, useState } from 'react';
import axios from 'axios';
import SkillCard from '../components/SkillCard';
import SkillForm from '../components/SkillForm';

export default function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchSkills = async () => {
    try {
      const { data } = await axios.get('/api/skills', { withCredentials: true });
      setSkills(data.skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Skills</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
        >
          Add Skill
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <SkillForm 
            onSuccess={(newSkill) => {
              setSkills([...skills, newSkill]);
              setShowForm(false);
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map(skill => (
          <SkillCard 
            key={skill._id}
            skill={skill}
            onDelete={() => fetchSkills()}
            onEdit={() => fetchSkills()}
          />
        ))}
      </div>
    </div>
  );
} 

i need all the tailwind removed and a css file for each of these files (those who need it)
they will all be in a folder names styles