import { useState } from 'react';
import axios from 'axios';
import '../styles/SkillForm.css';

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
    <form onSubmit={handleSubmit} className="form-container">
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="form-input"
      />
      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="form-input"
      />
      <select
        value={formData.level}
        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
        className="form-select"
      >
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Expert">Expert</option>
      </select>
      <input
        type="file"
        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
        className="form-file-input"
      />
      <button
        type="submit"
        className="submit-button"
      >
        {initialData ? 'Update Skill' : 'Add Skill'}
      </button>
    </form>
  );
}