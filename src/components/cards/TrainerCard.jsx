const TrainerCard = ({ trainer }) => (
  <div className="bg-[#111827] p-5 rounded-xl border border-gray-800">
    <h3 className="font-semibold">{trainer.name}</h3>
    <p className="text-gray-400">{trainer.specialization}</p>
    <button className="mt-3 bg-blue-600 px-3 py-1 rounded text-sm">
      Book
    </button>
  </div>
);

export default TrainerCard;
