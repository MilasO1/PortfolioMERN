import { useEffect, useState } from 'react';
import axios from 'axios';
import SkillCard from '../components/SkillCard';
import SkillForm from '../components/SkillForm';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('/api/skills', { withCredentials: true });
      console.log('API response:', response.data); // Log the full response
      
      // Check if response.data is an array directly or if it has a skills property
      if (Array.isArray(response.data)) {
        setSkills(response.data);
      } else if (response.data && Array.isArray(response.data.skills)) {
        setSkills(response.data.skills);
      } else {
        console.error('Unexpected API response format:', response.data);
        setSkills([]); // Set to empty array as fallback
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="page-title">My Skills</h1>
        <button
          onClick={() => setShowForm(true)}
          className="add-button"
        >
          Add Skill
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <SkillForm 
            onSuccess={(newSkill) => {
              setSkills([...skills, newSkill]);
              setShowForm(false);
            }}
          />
        </div>
      )}

      <div className="skills-grid">
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