-- Clear existing data
DELETE FROM Peers_SNG;

-- Reset identity
DBCC CHECKIDENT ('Peers_SNG', RESEED, 0);

-- Insert Kenya Counties data
INSERT INTO Peers_SNG (SNG, OSR, GCP, Include) VALUES
('Baringo', 321.4, 75459, 1),
('Bomet', 196.8, 151153, 1),
('Bungoma', 670.5, 205542, 1),
('Busia', 205.9, 88731, 1),
('Elgeyo/Marakwet', 105.9, 117229, 1),
('Embu', 236.7, 149912, 1),
('Garissa', 75.4, 58634, 1),
('Homa Bay', 166, 120751, 1),
('Isiolo', 125.1, 26555, 1),
('Kajiado', 544.5, 150709, 1),
('Kakamega', 639.8, 214365, 1),
('Kericho', 405.5, 163543, 1),
('Kiambu', 2192.1, 554515, 1),
('Kilifi', 685.5, 199953, 1),
('Kirinyaga', 312.9, 123709, 1),
('Kisii', 472.9, 198192, 1),
('Kisumu', 728.3, 247324, 1),
('Kitui', 244.4, 154345, 1),
('Kwale', 349.5, 119001, 1),
('Laikipia', 549.7, 94639, 1),
('Lamu', 89.6, 32747, 1),
('Machakos', 1075.9, 309164, 1),
('Makueni', 259.5, 110207, 1),
('Mandera', 78, 56964, 1),
('Marsabit', 81.8, 60486, 1),
('Meru', 551.3, 329977, 1),
('Migori', 292.8, 120639, 1),
('Mombasa', 3271.2, 468749, 1),
('Murang''a', 567.8, 200539, 1),
('Nairobi', 6733.3, 2682701, 0),
('Nakuru', 1511.6, 483938, 1),
('Nandi', 217, 149117, 1),
('Narok', 2310.9, 165462, 1),
('Nyamira', 133.1, 116992, 1),
('Nyandarua', 307.5, 149707, 1),
('Nyeri', 659.2, 209626, 1),
('Samburu', 192.6, 29090, 1),
('Siaya', 213.1, 103899, 1),
('Taita/Taveta', 216, 63592, 1),
('Tana River', 55.5, 29460, 1),
('Tharaka-Nithi', 190.4, 61461, 1),
('Trans Nzoia', 320.7, 165700, 1),
('Turkana', 157.2, 107450, 1),
('Uasin Gishu', 791.8, 227871, 1),
('Vihiga', 132.8, 83773, 1),
('Wajir', 58, 49159, 1),
('West Pokot', 90.7, 79417, 1);

-- Verify count
SELECT COUNT(*) AS TotalRecords FROM Peers_SNG;
