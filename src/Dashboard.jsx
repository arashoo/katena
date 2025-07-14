import React from 'react';

function Dashboard({ projects }) {
  // Separate projects
  const completedProjects = projects.filter(p =>
    p.steps.every(step => step.completed)
  );

  const upcomingProjects = projects.filter(p =>
    p.steps.every(step => !step.completed)
  );

  const currentProjects = projects.filter(p =>
    !completedProjects.includes(p) && !upcomingProjects.includes(p)
  );

  // Helper to get progress info
  const getProgress = (project) => {
    const totalSteps = project.steps.length;
    const completedSteps = project.steps.filter(s => s.completed).length;
    const percentageDone = Math.round((completedSteps / totalSteps) * 100);

    const currentStepIndex = project.steps.findIndex(s => !s.completed);
    const currentStep = currentStepIndex === -1 ? null : project.steps[currentStepIndex];
    const nextStep = currentStepIndex + 1 < totalSteps ? project.steps[currentStepIndex + 1] : null;
    const neededForNextStep = nextStep ? nextStep.needed : 'All steps completed';

    return {
      percentageDone,
      currentStep,
      nextStep,
      neededForNextStep
    };
  };

  return (
    <div>
      <section>
        <h2>Current Projects</h2>
        {currentProjects.length === 0 && <p>No current projects.</p>}
        {currentProjects.map(project => {
          const { percentageDone, currentStep, nextStep, neededForNextStep } = getProgress(project);

          return (
            <div key={project.id} className="project-card" style={{ marginBottom: '20px' }}>
              <h3>{project.clientName}</h3>
              <p><strong>Progress:</strong> {percentageDone}% done</p>
              <p><strong>Current Step:</strong> {currentStep?.name || 'All done'}</p>
              <p><strong>Next Step:</strong> {nextStep?.name || 'No next step'}</p>
              <p><strong>Needed for Next Step:</strong> {neededForNextStep}</p>
            </div>
          );
        })}
      </section>

      <section>
        <h2>Upcoming Projects</h2>
        {upcomingProjects.length === 0 && <p>No upcoming projects.</p>}
        {upcomingProjects.map(project => (
          <div key={project.id} className="project-card" style={{ marginBottom: '20px' }}>
            <h3>{project.clientName}</h3>
            <p>Starting soon...</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Completed Projects</h2>
        {completedProjects.length === 0 && <p>No completed projects.</p>}
        {completedProjects.map(project => (
          <div key={project.id} className="project-card" style={{ marginBottom: '20px' }}>
            <h3>{project.clientName}</h3>
            <p>All steps completed.</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Dashboard;
