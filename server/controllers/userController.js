import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";

export const ensureUserExists = async (userId) => User.findById(userId);

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user) return res.json({ success: false, message: "User Not Found" });
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const userEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId).populate("enrolledCourses");
    res.json({ success: true, enrolledCourses: user?.enrolledCourses || [] });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateUserCourseProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const userId = req.auth.userId;
    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId))
        return res.json({ success: true, message: "Lecture Already Completed" });
      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({ userId, courseId, lectureCompleted: [lectureId] });
    }
    res.json({ success: true, message: "Progress Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getUserCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.body;
    const progressData = await CourseProgress.findOne({ userId: req.auth.userId, courseId });
    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addUserRating = async (req, res) => {
  const userId = req.auth.userId;
  const { courseId, rating } = req.body;
  if (!courseId || !rating || rating < 1 || rating > 5)
    return res.json({ success: false, message: "Invalid Details" });

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.json({ success: false, message: "Course not found." });

    const user = await User.findById(userId);
    if (!user || !user.enrolledCourses.includes(courseId))
      return res.json({ success: false, message: "User has not purchased this course." });

    const idx = course.courseRatings.findIndex((r) => r.userId.toString() === userId.toString());
    if (idx > -1) course.courseRatings[idx].rating = rating;
    else course.courseRatings.push({ userId, rating });

    await course.save();
    return res.json({ success: true, message: "Rating added" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
