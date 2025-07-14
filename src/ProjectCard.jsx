import React from 'react';

function ProjectCard({ project, index, onToggleStep, onDelete }) {
  const { clientName, startDate, steps = [] } = project;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d) ? 'Invalid date' : d.toLocaleDateString();
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  let runningExpectedDate = new Date(startDate);
  let estimatedFinishDate = new Date(startDate);
  let mostBehind = { step: null, days: -Infinity };
  let mostAhead = { step: null, days: Infinity };

  return (
    <div className="project-card">
      <h3>{clientName}</h3>
      <h3>{addDays(estimatedFinishDate, 10).toDateString()}</h3>
      <p><strong>Start Date:</strong> {formatDate(startDate)}</p>

      <ul className="step-list">
        {steps.map((step, i) => {
          const estimated = step.estimated || 0;

          // Calculate expected date for this step by adding estimated days to runningExpectedDate
          runningExpectedDate = addDays(runningExpectedDate, estimated);
          const expectedDate = new Date(runningExpectedDate);
          estimatedFinishDate = expectedDate;

          let actualDate = step.completed && step.completedDate
            ? new Date(step.completedDate)
            : null;

          let status = '';
          if (step.completed && actualDate) {
            const diff = Math.round((actualDate - expectedDate) / (1000 * 60 * 60 * 24));
            if (diff > 0) {
              status = `⏰ ${diff} days behind`;
              if (diff > mostBehind.days) {
                mostBehind = { step: step.name, days: diff };
              }
            } else {
              status = `✅ ${Math.abs(diff)} days ahead`;
              if (diff < mostAhead.days) {
                mostAhead = { step: step.name, days: diff };
              }
            }
          } else {
            status = `📅 Expected: ${formatDate(expectedDate)}`;
          }

          return (
            <li key={i} className={step.completed ? 'step-completed' : 'step-pending'}>
              <div>
                <strong>{step.name}</strong> – <em>{estimated} day{estimated !== 1 ? 's' : ''}</em>
                <br />
                {status}
                {step.needed && !step.completed && (
                  <div><em>Needed:</em> {step.needed}</div>
                )}
              </div>
              <button onClick={() => onToggleStep(index, i)}>
                Mark as {step.completed ? 'Incomplete' : 'Complete'}
              </button>
            </li>
          );
        })}
      </ul>

      <p><strong>Estimated Finish Date:</strong> {formatDate(estimatedFinishDate)}</p>

      {mostBehind.step && mostBehind.days > 0 && (
        <p><strong>🚨 Most Behind:</strong> {mostBehind.step} ({mostBehind.days} days)</p>
      )}
      {mostAhead.step && mostAhead.days < 0 && (
        <p><strong>⚡ Most Ahead:</strong> {mostAhead.step} ({Math.abs(mostAhead.days)} days)</p>
      )}

      <button className="delete-button" onClick={() => onDelete(project.id)}>
        Delete
      </button>
    </div>
  );
}

export default ProjectCard;
