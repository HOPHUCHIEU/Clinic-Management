const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');

// Kết nối tới MongoDB
const connectionString = 'mongodb+srv://admin:1@cluster0.yae41.mongodb.net/ClinicManagement?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(connectionString)
    .then(() => console.log('Đã kết nối thành công tới MongoDB'))
    .catch((err) => console.log('Lỗi kết nối MongoDB:', err));

// Hàm để tạo số điện thoại Việt Nam hợp lệ
const generateVietnamPhoneNumber = () => {
    const prefix = faker.helpers.arrayElement(['03', '05', '07', '08', '09']); // Các đầu số phổ biến ở Việt Nam
    const phoneNumber = prefix + faker.string.numeric(8); // Tạo phần còn lại của số điện thoại
    return phoneNumber;
};

// Hàm để tạo nhiều bác sĩ và bệnh nhân
const insertBulkUsers = async (numDoctors, numPatients) => {
    try {
        const users = [];

        // Tạo dữ liệu mẫu cho Doctor
        for (let i = 0; i < numDoctors; i++) {
            const doctor = new User({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                phone: generateVietnamPhoneNumber(), // Số điện thoại Việt Nam hợp lệ
                address: faker.location.streetAddress(),
                gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
                role: 'doctor',
                password: faker.internet.password(10),
                birthdate: faker.date.past(40, new Date('2000-01-01')),
                specialties: [faker.helpers.arrayElement(['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics'])],
                imageUrl: faker.image.avatar(),
            });

            users.push(doctor);
        }

        // Tạo dữ liệu mẫu cho Patient
        for (let i = 0; i < numPatients; i++) {
            const patient = new User({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                phone: generateVietnamPhoneNumber(), // Số điện thoại Việt Nam hợp lệ
                address: faker.location.streetAddress(),
                gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
                role: 'patient',
                password: faker.internet.password(10),
                birthdate: faker.date.past(60, new Date('2010-01-01')),
                imageUrl: faker.image.avatar(),
            });

            users.push(patient);
        }

        // Chèn dữ liệu vào MongoDB
        await User.insertMany(users);
        console.log(`Đã chèn thành công ${numDoctors} bác sĩ và ${numPatients} bệnh nhân.`);
    } catch (error) {
        console.error('Có lỗi khi chèn dữ liệu:', error.message);
    } finally {
        mongoose.connection.close(); // Đóng kết nối sau khi hoàn thành
    }
};

// Gọi hàm để chèn 100 bác sĩ và 500 bệnh nhân
insertBulkUsers(0, 2);
