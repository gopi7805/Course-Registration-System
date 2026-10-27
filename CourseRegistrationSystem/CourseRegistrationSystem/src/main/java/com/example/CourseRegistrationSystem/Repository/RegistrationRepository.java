package com.example.CourseRegistrationSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.CourseRegistrationSystem.Model.Registration;

public interface RegistrationRepository extends JpaRepository<Registration, Integer> {

    boolean existsByCourse_Id(Integer courseId);
}
