import Header from './Header'; // Assuming Header.jsx exists
import Sidebar from './Sidebar'; // Assuming Sidebar.jsx exists

const PageWrapper = ({ role, children }) => {
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
          {/* Whatever page you put inside the wrapper will show up here */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageWrapper;