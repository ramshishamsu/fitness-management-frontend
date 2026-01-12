import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash, Edit, Search, Filter } from 'lucide-react';
import axios from '../api/axios';

const WorkoutLogger = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    equipment: '',
    search: ''
  });

  // Form state
  const [workoutForm, setWorkoutForm] = useState({
    title: '',
    description: '',
    category: 'strength',
    difficulty: 'beginner',
    date: new Date().toISOString().split('T')[0],
    exercises: []
  });

  // Exercise library pagination
  const [exercisePage, setExercisePage] = useState(1);
  const [exercisePagination, setExercisePagination] = useState(null);

  // Load exercises
  useEffect(() => {
    if (showExerciseLibrary) {
      loadExercises();
    }
  }, [showExerciseLibrary, filters, exercisePage]);

  // Load user workouts
  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadExercises = async () => {
    try {
      const params = new URLSearchParams({
        ...filters,
        page: exercisePage
      });
      
      const response = await axios.get(`/api/workouts/exercises?${params}`);
      setExercises(response.data.exercises);
      setExercisePagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  const loadWorkouts = async () => {
    try {
      const response = await axios.get('/api/workouts/my');
      setWorkouts(response.data.workouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const handleAddExercise = (exercise) => {
    const newExercise = {
      ...exercise,
      sets: 0,
      reps: 0,
      weight: 0,
      duration: 0,
      calories: 0,
      notes: ''
    };
    setWorkoutForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...workoutForm.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    
    // Recalculate totals
    const totalDuration = updatedExercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
    const totalCalories = updatedExercises.reduce((sum, ex) => sum + (ex.calories || 0), 0);

    setWorkoutForm(prev => ({
      ...prev,
      exercises: updatedExercises,
      totalDuration,
      totalCalories
    }));
  };

  const removeExercise = (index) => {
    const updatedExercises = workoutForm.exercises.filter((_, i) => i !== index);
    
    const totalDuration = updatedExercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
    const totalCalories = updatedExercises.reduce((sum, ex) => sum + (ex.calories || 0), 0);

    setWorkoutForm(prev => ({
      ...prev,
      exercises: updatedExercises,
      totalDuration,
      totalCalories
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!workoutForm.title || workoutForm.exercises.length === 0) {
      alert('Please add a title and at least one exercise');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/workouts', workoutForm);
      alert('Workout logged successfully!');
      setWorkoutForm({
        title: '',
        description: '',
        category: 'strength',
        difficulty: 'beginner',
        date: new Date().toISOString().split('T')[0],
        exercises: []
      });
      loadWorkouts();
    } catch (error) {
      console.error('Error logging workout:', error);
      alert('Error logging workout');
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (workoutId) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      await axios.delete(`/api/workouts/${workoutId}`);
      alert('Workout deleted successfully');
      loadWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Error deleting workout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Log Workout</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Workout Title</label>
                <input
                  type="text"
                  value={workoutForm.title}
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  placeholder="e.g., Morning Strength Training"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={workoutForm.date}
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={workoutForm.category}
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                >
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="hiit">HIIT</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                <select
                  value={workoutForm.difficulty}
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={workoutForm.description}
                onChange={(e) => setWorkoutForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                placeholder="Workout details and notes..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Exercises</h3>
                <button
                  type="button"
                  onClick={() => setShowExerciseLibrary(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="mr-2" />
                  Add from Library
                </button>
              </div>

              {workoutForm.exercises.map((exercise, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-medium">{exercise.name}</h4>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sets</label>
                      <input
                        type="number"
                        min="0"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reps</label>
                      <input
                        type="number"
                        min="0"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={exercise.weight}
                        onChange={(e) => handleExerciseChange(index, 'weight', parseFloat(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration (min)</label>
                      <input
                        type="number"
                        min="0"
                        value={exercise.duration}
                        onChange={(e) => handleExerciseChange(index, 'duration', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Calories</label>
                      <input
                        type="number"
                        min="0"
                        value={exercise.calories}
                        onChange={(e) => handleExerciseChange(index, 'calories', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      value={exercise.notes}
                      onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      placeholder="Exercise notes..."
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const newExercise = {
                      name: '',
                      category: 'strength',
                      sets: 0,
                      reps: 0,
                      weight: 0,
                      duration: 0,
                      calories: 0,
                      notes: ''
                    };
                    handleAddExercise(newExercise);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  <Plus className="mr-2" />
                  Add Custom Exercise
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Total Duration: {workoutForm.totalDuration} minutes | 
                Total Calories: {workoutForm.totalCalories}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Logging...' : 'Log Workout'}
              </button>
            </div>
          </form>
        </div>

        {/* Exercise Library Modal */}
        {showExerciseLibrary && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full z-50">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                  <h3 className="text-xl font-bold">Exercise Library</h3>
                  <button
                    onClick={() => setShowExerciseLibrary(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                {/* Exercise Filters */}
                <div className="p-6 border-b">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Search</label>
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                        placeholder="Search exercises..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        value={filters.category}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      >
                        <option value="">All Categories</option>
                        <option value="strength">Strength</option>
                        <option value="cardio">Cardio</option>
                        <option value="flexibility">Flexibility</option>
                        <option value="balance">Balance</option>
                        <option value="core">Core</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                      <select
                        value={filters.difficulty}
                        onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      >
                        <option value="">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Equipment</label>
                      <select
                        value={filters.equipment}
                        onChange={(e) => setFilters(prev => ({ ...prev, equipment: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      >
                        <option value="">All Equipment</option>
                        <option value="none">No Equipment</option>
                        <option value="dumbbells">Dumbbells</option>
                        <option value="barbell">Barbell</option>
                        <option value="resistance_bands">Resistance Bands</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Exercise List */}
                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exercises.map((exercise) => (
                      <div key={exercise._id} className="border rounded-lg p-4 hover:shadow-md cursor-pointer bg-gray-50">
                        <h4 className="font-medium text-lg mb-2">{exercise.name}</h4>
                        <p className="text-gray-600 text-sm mb-2">{exercise.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {exercise.muscleGroups.map((muscle, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {muscle}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>Category: {exercise.category}</span>
                          <span>Difficulty: {exercise.difficulty}</span>
                        </div>

                        <button
                          onClick={() => {
                            handleAddExercise(exercise);
                            setShowExerciseLibrary(false);
                          }}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Add to Workout
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                {exercisePagination && (
                  <div className="p-6 border-t flex justify-center">
                    <div className="flex space-x-2">
                      {Array.from({ length: exercisePagination.pages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setExercisePage(page)}
                          className={`px-3 py-1 rounded ${page === exercisePagination.page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Workouts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Workouts</h3>
          
          {workouts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No workouts logged yet. Start your first workout above!</p>
          ) : (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div key={workout._id} className="border rounded-lg p-4 hover:shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-medium">{workout.title}</h4>
                      <p className="text-gray-600 text-sm">{workout.category} • {workout.difficulty}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/workouts/${workout._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => deleteWorkout(workout._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>Duration: {workout.totalDuration} min</div>
                    <div>Calories: {workout.totalCalories}</div>
                    <div>Exercises: {workout.exercises?.length || 1}</div>
                    <div>Date: {new Date(workout.date).toLocaleDateString()}</div>
                  </div>

                  {workout.description && (
                    <p className="text-gray-700 mt-3">{workout.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutLogger;
