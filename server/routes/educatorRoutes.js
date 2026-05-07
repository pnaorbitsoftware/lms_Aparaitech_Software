import express from "express";
import {
  addCourse, updateCourse, deleteCourse, educatorDashboardData,
  getEducatorCourses, getEducatorCourseById, getEnrolledStudentsData,
  updateRoleToEducator, removeStudentAccess, getAllStudents, assignCourse,
} from "../controllers/educatorController.js";
import upload from "../configs/multer.js";

const educatorRouter = express.Router();

educatorRouter.get("/update-role", updateRoleToEducator);
educatorRouter.post("/add-course", upload.fields([{ name: "image", maxCount: 1 }, { name: "pdfs", maxCount: 10 }]), addCourse);
educatorRouter.get("/courses", getEducatorCourses);
educatorRouter.get("/course/:id", getEducatorCourseById);
educatorRouter.put("/course/:id", upload.fields([{ name: "image", maxCount: 1 }, { name: "pdfs", maxCount: 10 }]), updateCourse);
educatorRouter.delete("/course/:id", deleteCourse);
educatorRouter.get("/dashboard", educatorDashboardData);
educatorRouter.get("/enrolled-students", getEnrolledStudentsData);
educatorRouter.delete("/remove-student/:courseId/:studentId", removeStudentAccess);
educatorRouter.get("/all-students", getAllStudents);
educatorRouter.post("/assign-course", assignCourse);

export default educatorRouter;
