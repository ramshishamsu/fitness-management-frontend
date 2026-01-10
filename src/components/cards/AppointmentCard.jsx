const AppointmentCard = ({ appointment }) => (
  <div className="bg-[#111827] p-5 rounded-xl border border-gray-800">
    <p><b>Trainer:</b> {appointment.trainer}</p>
    <p><b>Date:</b> {appointment.date}</p>
    <p className="text-green-400">Confirmed</p>
  </div>
);

export default AppointmentCard;
