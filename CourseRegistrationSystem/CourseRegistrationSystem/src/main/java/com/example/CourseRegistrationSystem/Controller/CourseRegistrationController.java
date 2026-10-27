package com.example.CourseRegistrationSystem.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.CourseRegistrationSystem.Model.Course;
import com.example.CourseRegistrationSystem.Model.Registration;
import com.example.CourseRegistrationSystem.Service.CourseRegistrationService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CourseRegistrationController {

    private final CourseRegistrationService service;

    public CourseRegistrationController(CourseRegistrationService service) {
        this.service = service;
    }

    // 1. Get all courses
    @GetMapping("/courses")
    public List<Course> getAllCourses() {
        return service.getAllCourses();
    }

    // 2. Add a new course
    @PostMapping("/courses")
    public Course addCourse(@RequestBody Course course) {
        return service.addCourse(course);
    }

    // 3. Update a course
    @PutMapping("/courses/{id}")
    public Course updateCourse(@PathVariable Integer id,
                               @RequestBody Course course) {
        return service.updateCourse(id, course);
    }

    // 4. Delete a course
    @DeleteMapping("/courses/{id}")
    public String deleteCourse(@PathVariable Integer id) {
        return service.deleteCourse(id);
    }

    // 5. Register a student
    @PostMapping("/registrations")
    public Registration registerStudent(
            @RequestParam String studentName,
            @RequestParam String email,
            @RequestParam Integer courseId) {

        return service.registerStudent(studentName, email, courseId);
    }

    // 6. Get all registered students
    @GetMapping("/registrations")
    public List<Registration> getAllRegistrations() {
        return service.getAllRegistrations();
    }

    // 7. Add multiple courses
    @PostMapping("/courses/bulk")
    public List<Course> addCourses(@RequestBody List<Course> courses) {
        return service.addCourses(courses);
    }

}
