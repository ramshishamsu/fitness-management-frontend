import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import { getUserWorkouts } from "../../api/workoutApi";

const TrainerViewUserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [userRes, workoutsRes, progressRes] = await Promise.all([
          axios.get(`/users/${id}`),
          getUserWorkouts(id),
          axios.get(`/progress?userId=${id}`)
        ]);

        setUser(userRes.data);
        setWorkouts(workoutsRes.data.workouts || []);
        setProgress(progressRes.data.progressLogs || []);
      } catch (err) {
        console.error('Failed to load user profile', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{user.name}</h2>
      <p className="text-neutral-400 mb-4">{user.email}</p>

      <section className="mb-6">
        <h3 className="font-semibold">Workouts assigned</h3>
        {workouts.length === 0 ? (
          <p className="text-sm text-neutral-400">No workouts assigned by you</p>
        ) : (
          workouts.map(w => (
            <div key={w._id} className="p-3 bg-neutral-900 rounded mb-3">
              <div className="font-medium">{w.title}</div>
              <div className="text-sm text-neutral-400">{w.exercises?.map(e => e.name).join(', ')}</div>
            </div>
          ))
        )}
      </section>

      <section>
        <h3 className="font-semibold">Progress logs</h3>
        {progress.length === 0 ? (
          <p className="text-sm text-neutral-400">No progress logs</p>
        ) : (
          progress.map(p => (
            <div key={p._id} className="p-3 bg-neutral-900 rounded mb-3">
              <div className="text-sm">{new Date(p.date).toLocaleDateString()}</div>
              <div className="text-sm text-neutral-400 mt-1">Notes: {p.notes || '—'}</div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default TrainerViewUserProfile;
