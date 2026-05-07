import React, { useContext } from "react";
import { Routes, Route, Navigate, useMatch } from "react-router-dom";
import { AppContext } from "./context/AppContext";
import Navbar, { AllProjectsProvider, AllProjectsContext } from "./components/student/Navbar";
import Home from "./pages/student/Home";
import CourseDetails from "./pages/student/CourseDetails";
import CoursesList from "./pages/student/CoursesList";
import Dashboard from "./pages/educator/Dashboard";
import AddCourse from "./pages/educator/AddCourse";
import EditCourse from "./pages/educator/EditCourse";
import MyCourses from "./pages/educator/MyCourses";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";
import Educator from "./pages/educator/Educator";
import AssignCourse from "./pages/educator/AssignCourse";
import "quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Player from "./pages/student/Player";
import MyEnrollments from "./pages/student/MyEnrollments";
import Loading from "./components/student/Loading";
import WhatsAppButton from "./components/common/WhatsAppButton";
import About from "./pages/student/About";
import Contact from "./pages/student/Contact";
import AllProjectsModal from "./components/student/AllProjectsModal";
import InquiryModal from "./components/common/InquiryModal";
import AllProjectsPage from "./pages/student/AllProjectsPage";
import LoginModal from "./components/student/LoginModal";

const App = () => {
  const isEducatorRoute = useMatch("/educator/*");
  return (
    <AllProjectsProvider>
      <AppContent isEducatorRoute={isEducatorRoute} />
    </AllProjectsProvider>
  );
};

const AppContent = ({ isEducatorRoute }) => {
  const { isEducator, showLogin } = useContext(AppContext);
  const { isAllProjectsOpen, setIsAllProjectsOpen } = useContext(AllProjectsContext);

  return (
    <div className="text-default min-h-screen bg-white relative">
      <ToastContainer />
      {showLogin && <LoginModal />}
      {!isEducatorRoute && <Navbar />}
      {!isEducatorRoute && (
        <AllProjectsModal isOpen={isAllProjectsOpen} onClose={() => setIsAllProjectsOpen(false)} />
      )}
      {!isEducatorRoute && <InquiryModal />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/all-projects" element={<AllProjectsPage />} />
        <Route path="/educator/*" element={isEducator ? <Educator /> : <Navigate to="/" replace />}>
          <Route index element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="course/:courseId/edit" element={<EditCourse />} />
          <Route path="student-enrolled" element={<StudentsEnrolled />} />
          <Route path="assign-course" element={<AssignCourse />} />
        </Route>
      </Routes>

      <WhatsAppButton />
    </div>
  );
};

export default App;
