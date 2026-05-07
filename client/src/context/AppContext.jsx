import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();
axios.defaults.withCredentials = true;

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = "₹";
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [isEducator, setIsEducator] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const getToken = () => token;

  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/all`, { timeout: 8000 });
      if (data?.success) setAllCourses(data.courses || []);
      else { toast.error(data?.message || "Failed to load courses."); setAllCourses([]); }
    } catch (e) {
      toast.error(e.message || "Error fetching courses.");
      setAllCourses([]);
    }
  };

  const fetchUserData = async () => {
    if (!token) { setUserData(null); return; }
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, { headers: authHeader(), timeout: 8000 });
      if (data?.success) {
        setUserData(data.user);
        setIsEducator(data.user.role === "educator" || data.user.role === "admin");
      } else toast.error(data?.message || "Failed to load user data.");
    } catch (e) {
      if (e.response?.status === 401) { logout(); }
      else toast.error(e.message || "Error fetching user data.");
    }
  };

  const fetchUserEnrolledCourses = async () => {
    if (!token) { setEnrolledCourses([]); return; }
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/enrolled-courses`, { headers: authHeader(), timeout: 8000 });
      if (data?.success) setEnrolledCourses(data.enrolledCourses.reverse());
      else toast.error(data?.message || "Failed to load enrolled courses.");
    } catch (e) {
      setEnrolledCourses([]);
    }
  };

  const fetchCourseById = async (courseId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/${courseId}`, { timeout: 8000 });
      if (data?.success) return data.courseData;
      toast.error(data?.message || "Failed to load course.");
      return null;
    } catch (e) {
      toast.error(e.message || "Error fetching course.");
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
      if (data?.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUserData(data.user);
        setIsEducator(data.user.role === "educator" || data.user.role === "admin");
        setShowLogin(false);
        if (data.user.role === "educator" || data.user.role === "admin") navigate("/educator");
        else navigate("/");
        return { success: true };
      }
      return { success: false, message: data?.message };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
      if (data?.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setUserData(data.user);
        setIsEducator(false);
        setShowLogin(false);
        navigate("/");
        return { success: true };
      }
      return { success: false, message: data?.message };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setUserData(null);
    setIsEducator(false);
    setEnrolledCourses([]);
    navigate("/");
  };

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach((l) => (time += l.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach((ch) => ch.chapterContent.forEach((l) => (time += l.lectureDuration)));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateRating = (course) => {
    if (!course.courseRatings.length) return 0;
    return Math.floor(course.courseRatings.reduce((a, r) => a + r.rating, 0) / course.courseRatings.length);
  };

  const calculateNoOfLectures = (course) =>
    course.courseContent.reduce((t, ch) => t + (ch.chapterContent?.length || 0), 0);

  useEffect(() => { fetchAllCourses(); }, []);
  useEffect(() => { if (token) { fetchUserData(); fetchUserEnrolledCourses(); } }, [token]);

  const value = {
    showLogin, setShowLogin, backendUrl, currency, navigate,
    userData, setUserData, fetchUserData, getToken, token,
    allCourses, fetchAllCourses, enrolledCourses, setEnrolledCourses,
    fetchUserEnrolledCourses, fetchCourseById,
    calculateChapterTime, calculateCourseDuration, calculateRating,
    calculateNoOfLectures, isEducator, setIsEducator,
    login, register, logout,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
