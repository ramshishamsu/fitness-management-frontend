const WorkoutCard = ({ workout }) => (
  <div className="bg-[#111827] p-5 rounded-xl border border-gray-800">
    <h3 className="font-semibold">{workout.title}</h3>
    <p className="text-gray-400">{workout.duration} mins</p>
  </div>
);

export default WorkoutCard;
