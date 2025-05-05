INSERT INTO users (name, email, password)
VALUES ('Brendad B', 'brendad@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Brendude B', 'brendude@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Brendan B', 'brendan@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES
(1, 'Small Castle', 'description', 'https://thumbnail1.com', 'https://coverphoto1.com', 100, 1, 1, 1, 'Small Country', 'Small Street', 'Small City', 'Small Province', '123456', true),
(2, 'Medium Castle', 'description', 'https://thumbnail2.com', 'https://coverphoto2.com', 200, 2, 2, 2, 'Medium Country', 'Medium Street', 'Medium City', 'Medium Province', '234567', true),
(3, 'Large Castle', 'description', 'https://thumbnail3.com', 'https://coverphoto3.com', 300, 3, 3, 3, 'Large Country', 'Large Street', 'Large City', 'Large Province', '345678', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2023-10-01', '2023-10-14', 3, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 8, 'Hey, I guess. Welcome, kinda...'),
(2, 2, 2, 9, 'Hey, welcome! I hope you have a great stay.'),
(3, 3, 3, 10, 'The sun pales in comparison to your beautiful smile, and I consider myself blessed to have you stay here. I love you.');