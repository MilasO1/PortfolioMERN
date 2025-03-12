import { useState } from 'react';
import { deleteSkill } from '../api/skills';
import SkillForm from './SkillForm';
import '../styles/SkillCard.css';

export default function SkillCard({ skill, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill(skill._id);
        onDelete();
      } catch (error) {
        console.error('Error deleting skill:', error);
      }
    }
  };


  const levelClasses = {
    Beginner: 'level-beginner',
    Intermediate: 'level-intermediate',
    Expert: 'level-expert'
  };

  if (isEditing) {
    return (
      <div className="skill-card editing">
        <div className="card-content">
          <h3 className="card-title">Edit Skill</h3>
          <SkillForm
            initialData={skill}
            onSuccess={(updatedSkill) => {
            setIsEditing(false);
            onEdit();
            }}
          />
          <button
            onClick={() => setIsEditing(false)}
            className="btn btn-secondary full-width"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="skill-card">
      {skill.imageUrl && (
        <div className="card-image">
          <img
            src={skill.imageUrl}
            alt={skill.title}
          />
        </div>
      )}
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{skill.title}</h3>
          <span className={`level-badge ${levelClasses[skill.level] || ''}`}>
            {skill.level}
          </span>
        </div>
        <p className="card-category">{skill.category}</p>
        <div className="card-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-edit"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}