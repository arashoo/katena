import { useState } from 'react';

function ProjectForm({ onAdd }) {
  const [clientName, setClientName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [stepEstimates, setStepEstimates] = useState({
    Contract: 3,
    Measurements: 5,
    Plan: 14,
    "Order Materials": 10,
    Production: 30,
    Shipping: 7,
    Installation: 5
  });

  const handleEstimateChange = (step, value) => {
    setStepEstimates(prev => ({
      ...prev,
      [step]: Number(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const steps = Object.entries(stepEstimates).map(([stepName, estimate]) => ({
      name: stepName,
      completed: false,
      estimatedDays: estimate,
      needed: '' // optional: you can add a field for 'needed'
    }));

    const newProject = {
      clientName,
      startDate: startDate || new Date().toISOString().split('T')[0],
      steps
    };

    onAdd(newProject);
    setClientName('');
    setStartDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <input
        type="text"
        placeholder="Client Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        required
      />

      <label>Start Date:</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />

      <label>Estimated Time (days) for each step:</label>
      {Object.keys(stepEstimates).map((step) => (
        <div key={step}>
          <label>{step}</label>
          <input
            type="number"
            min="1"
            value={stepEstimates[step]}
            onChange={(e) => handleEstimateChange(step, e.target.value)}
          />
        </div>
      ))}

      <button type="submit">Add Project</button>
    </form>
  );
}

export default ProjectForm;
