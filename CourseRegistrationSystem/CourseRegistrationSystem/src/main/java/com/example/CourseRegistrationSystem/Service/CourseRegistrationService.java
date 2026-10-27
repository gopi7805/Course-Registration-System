package com.example.CourseRegistrationSystem.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.CourseRegistrationSystem.Model.Course;
import com.example.CourseRegistrationSystem.Model.Registration;
import com.example.CourseRegistrationSystem.Repository.CourseRepository;
import com.example.CourseRegistrationSystem.Repository.RegistrationRepository;

@Service
public class CourseRegistrationService {

    private final CourseRepository courseRepository;
    private final RegistrationRepository registrationRepository;

    public CourseRegistrationService(CourseRepository courseRepository,
                                     RegistrationRepository registrationRepository) {
        this.courseRepository = courseRepository;
        this.registrationRepository = registrationRepository;
    }

    // 1. Get all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // 2. Add a new course
    public Course addCourse(Course course) {
        course.setId(null);
        return courseRepository.save(course);
    }

    // 3. Update an existing course
    public Course updateCourse(Integer id, Course courseDetails) {

        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        existingCourse.setCourseName(courseDetails.getCourseName());
        existingCourse.setDescription(courseDetails.getDescription());
        existingCourse.setDuration(courseDetails.getDuration());
        existingCourse.setFee(courseDetails.getFee());

        return courseRepository.save(existingCourse);
    }

    // 4. Delete a course only if no students are registered
    public String deleteCourse(Integer id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (registrationRepository.existsByCourse_Id(id)) {
            throw new RuntimeException(
                    "Cannot delete this course because students are registered for it");
        }

        courseRepository.delete(course);

        return "Course deleted successfully";
    }

    // 5. Register a student for a course
    public Registration registerStudent(String studentName,
                                        String email,
                                        Integer courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Registration registration = new Registration();

        registration.setStudentName(studentName);
        registration.setEmail(email);
        registration.setCourse(course);
        registration.setRegistrationDate(LocalDate.now());

        return registrationRepository.save(registration);
    }

    // 6. Get all registered students
    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    // 7. Add multiple courses at once
    public List<Course> addCourses(List<Course> courses) {

        for (Course course : courses) {
            course.setId(null);
        }

        return courseRepository.saveAll(courses);
    }

}

