CREATE DATABASE online_tuition;
USE online_tuition;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'TUTOR', 'ADMIN') NOT NULL
);

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course VARCHAR(100),
    phone VARCHAR(15),
    address VARCHAR(200),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE tutors (
    tutor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject VARCHAR(100),
    qualification VARCHAR(100),
    experience INT,
    phone VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE availability (
    availability_id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NOT NULL,
    available_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    FOREIGN KEY (tutor_id) REFERENCES tutors(tutor_id)
);

CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    tutor_id INT NOT NULL,
    availability_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'BOOKED',
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (tutor_id) REFERENCES tutors(tutor_id),
    FOREIGN KEY (availability_id) REFERENCES availability(availability_id)
);

CREATE TABLE fees (
    fee_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE,
    payment_method VARCHAR(30),
    status VARCHAR(20) DEFAULT 'PENDING',
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);