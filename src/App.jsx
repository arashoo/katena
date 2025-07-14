import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from './firebase';
import {
  collection,
  deleteDoc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';

import Auth from './Auth';
import Dashboard from './Dashboard';
import Projects from './Projects';
import Inventory from './Inventory';
import ProjectForm from './ProjectForm';
import ProjectCard from './ProjectCard';

import './style.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);  // Firestore collection is usually lowercase 'users'
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setRole(userData.role || 'customer'); // default to customer if no role
          } else {
            // User doc doesn't exist yet — assign default role
            await setDoc(userRef, { role: 'customer' });
            setRole('customer');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setRole('customer'); // fallback role
        }
      } else {
        setRole(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user && role) {
      fetchProjects();
    } else {
      setProjects([]);
    }
  }, [user, role]);

  const fetchProjects = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      let q;

      if (role === 'admin') {
        // Admin gets all projects
        q = collection(db, 'projects');
      } else {
        // Others get only their own projects
        q = query(collection(db, 'projects'), where('userId', '==', user.uid));
      }

      const snapshot = await getDocs(q);
      const projectList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProjects(projectList);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Could not load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project) => {
    try {
      await addDoc(collection(db, 'projects'), {
        ...project,
        userId: user.uid,
      });
      fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      // Refresh projects list after deletion
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const toggleStep = async (projectIndex, stepIndex) => {
    try {
      const updatedProjects = [...projects];
      const project = updatedProjects[projectIndex];
      project.steps[stepIndex].completed = !project.steps[stepIndex].completed;
      project.steps[stepIndex].completedDate = project.steps[stepIndex].completed ? new Date().toISOString() : null;
      const projectDocRef = doc(db, 'projects', project.id);
      await updateDoc(projectDocRef, { steps: project.steps });
      fetchProjects();
    } catch (error) {
      console.error('Error updating step:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return <Auth />;

  return (
    <div className="container">
      <h1>🛠️ Katena Project Tracker</h1>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      <div className="nav-tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button
          className={activeTab === 'inventory' ? 'active' : ''}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
      </div>

      {activeTab === 'dashboard' && <Dashboard projects={projects} />}

      {activeTab === 'projects' && (
        <>
          <ProjectForm onAdd={addProject} />
          {loading && <p>Loading projects...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="projects-list">
            {projects.length === 0 && !loading ? (
              <p>No projects found.</p>
            ) : (
              projects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onToggleStep={toggleStep}
                  onDelete={deleteProject}
                />
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'inventory' && <Inventory />}
    </div>
  );
}

export default App;
