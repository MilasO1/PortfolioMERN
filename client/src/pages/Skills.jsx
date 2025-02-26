import { useEffect, useState } from 'react';
import { getSkills } from '../api/skills';
import SkillCard from '../components/SkillCard';
import '../styles/Skills.css';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    level: ''
  });

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const { data } = await getSkills();
      setSkills(data.skills || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch skills. Please try again later.');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Get unique categories from skills
  const categories = [...new Set(skills.map(skill => skill.category))];
  
  // Filter skills based on selected filters
  const filteredSkills = skills.filter(skill => {
    return (
      (filters.category === '' || skill.category === filters.category) &&
      (filters.level === '' || skill.level === filters.level)
    );
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      level: ''
    });
  };

  return (
    <div className="skills-container">
      <h1 className="page-title">Skills Library</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="filter-section">
        <h2 className="section-title">Filter Skills</h2>
        <div className="filter-grid">
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="level">Level</label>
            <select
              id="level"
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          
          <div className="filter-actions">
            <button
              onClick={clearFilters}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          <div className="skills-count">
            Showing {filteredSkills.length} of {skills.length} skills
          </div>
          
          <div className="skills-grid">
            {filteredSkills.map(skill => (
              <SkillCard 
                key={skill._id}
                skill={skill}
                onDelete={fetchSkills}
                onEdit={fetchSkills}
              />
            ))}
          </div>
          
          {filteredSkills.length === 0 && (
            <div className="no-results">
              No skills found matching your filters.
            </div>
          )}
        </>
      )}
    </div>
  );
}