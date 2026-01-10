const UserNavbar = ({ setSidebarOpen }) => {
  return (
    <header className="h-16 flex items-center px-6 border-b border-[#1F2937] bg-[#050505]">
      <button
        className="md:hidden text-xl mr-4"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      <h1 className="font-semibold tracking-wide text-white">
        User Dashboard
      </h1>
    </header>
  );
};

export default UserNavbar;
