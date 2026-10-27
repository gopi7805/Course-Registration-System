package com.example.CourseRegistrationSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.CourseRegistrationSystem.Model.Course;

public interface CourseRepository extends JpaRepository<Course, Integer> {

}