import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />

      <main className="container my-4">
        {children}
      </main>

      <Footer />
    </>
  );
}

export default MainLayout;