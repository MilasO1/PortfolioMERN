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
    
    
    if (formData.image) {
      data.append('imageUrl', formData.image); 
    }
  
    try {
      const endpoint = initialData 
        ? `/api/skills/${initialData._id}`
        : '/api/skills/addSkills';
      const method = initialData ? 'put' : 'post';
      
      console.log(`Sending ${method.toUpperCase()} request to ${endpoint}`);
      
      const response = await axios[method](endpoint, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
  
      console.log("Server response:", response.data);
      
      if (response.data && response.data.skill) {
        onSuccess(response.data.skill);
      } else {
        console.error('Unexpected response format:', response.data);
        // Still call onSuccess to close the form even if response format is unexpected
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      if (error.response) {
        console.error('Server error response:', error.response.data);
      }
      alert('Failed to save skill. Please try again.');
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
        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] || null })}
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