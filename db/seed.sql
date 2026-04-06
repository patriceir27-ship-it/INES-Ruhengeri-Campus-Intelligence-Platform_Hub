-- ============================================================
-- INES-Ruhengeri Seed Data
-- ============================================================

-- DEPARTMENTS
INSERT INTO departments (code, name, faculty, head_name) VALUES
  ('ENG',  'Engineering',               'Faculty of Applied Sciences',     'Dr. Habimana Jean Pierre'),
  ('MED',  'Medicine & Health Sciences','Faculty of Medicine',              'Dr. Uwimana Claudine'),
  ('ICT',  'Information & Communication Technology', 'Faculty of Technology','Dr. Nkurunziza Eric'),
  ('BUS',  'Business Administration',   'Faculty of Business',             'Dr. Mukamana Solange'),
  ('AGR',  'Agriculture',               'Faculty of Agriculture',           'Dr. Bizimungu Innocent'),
  ('EDU',  'Education',                 'Faculty of Education',             'Dr. Uwase Pascale'),
  ('LAW',  'Law',                       'Faculty of Law & Governance',     'Dr. Nsengimana Charles'),
  ('ENV',  'Environmental Sciences',    'Faculty of Applied Sciences',     'Dr. Mukamurenzi Aline')
ON CONFLICT (code) DO NOTHING;

-- STAFF (30 staff members)
INSERT INTO staff (staff_id, full_name, email, dept_id, role, teaching_hrs, performance, workload, burnout_risk) VALUES
  ('STF001','Dr. Habimana Jean Pierre',  'j.habimana@ines.ac.rw',  1,'senior_lecturer',22,88,0.92,true),
  ('STF002','Dr. Uwimana Claudine',      'c.uwimana@ines.ac.rw',   2,'senior_lecturer',18,91,0.75,false),
  ('STF003','Dr. Nkurunziza Eric',       'e.nkurunziza@ines.ac.rw',3,'senior_lecturer',20,85,0.83,false),
  ('STF004','Dr. Mukamana Solange',      's.mukamana@ines.ac.rw',  4,'senior_lecturer',16,93,0.67,false),
  ('STF005','Dr. Bizimungu Innocent',    'i.bizimungu@ines.ac.rw', 5,'senior_lecturer',24,79,0.98,true),
  ('STF006','Mr. Niyonzima Patrick',     'p.niyonzima@ines.ac.rw', 1,'lecturer',       18,82,0.75,false),
  ('STF007','Ms. Uwase Pascale',         'p.uwase@ines.ac.rw',     6,'senior_lecturer',20,90,0.83,false),
  ('STF008','Dr. Nsengimana Charles',    'c.nsengimana@ines.ac.rw',7,'senior_lecturer',16,87,0.67,false),
  ('STF009','Mr. Hakizimana Felix',      'f.hakizimana@ines.ac.rw',3,'lecturer',       22,76,0.92,true),
  ('STF010','Ms. Iradukunda Ange',       'a.iradukunda@ines.ac.rw',2,'lecturer',       18,84,0.75,false),
  ('STF011','Mr. Nzabonimpa Gilbert',    'g.nzabonimpa@ines.ac.rw',4,'lecturer',       14,78,0.58,false),
  ('STF012','Ms. Mukagasana Rose',       'r.mukagasana@ines.ac.rw',5,'lecturer',       20,81,0.83,false),
  ('STF013','Mr. Gahima Olivier',        'o.gahima@ines.ac.rw',    1,'lecturer',       16,85,0.67,false),
  ('STF014','Ms. Uwineza Diane',         'd.uwineza@ines.ac.rw',   3,'lecturer',       20,88,0.83,false),
  ('STF015','Mr. Rukundo Emmanuel',      'e.rukundo@ines.ac.rw',   6,'lecturer',       18,72,0.75,false),
  ('STF016','Ms. Ingabire Clementine',   'c.ingabire@ines.ac.rw',  2,'lecturer',       22,86,0.92,true),
  ('STF017','Mr. Havugimana Sylvestre',  's.havugimana@ines.ac.rw',7,'lecturer',       14,80,0.58,false),
  ('STF018','Ms. Nizeyimana Vestine',    'v.nizeyimana@ines.ac.rw',4,'lecturer',       18,83,0.75,false),
  ('STF019','Mr. Bigirimana Theoneste',  't.bigirimana@ines.ac.rw',5,'lecturer',       16,77,0.67,false),
  ('STF020','Ms. Mukamurenzi Aline',     'a.mukamurenzi@ines.ac.rw',8,'senior_lecturer',18,89,0.75,false),
  ('STF021','Mr. Ntaganda Pacifique',    'p.ntaganda@ines.ac.rw',  1,'lecturer',       20,74,0.83,false),
  ('STF022','Ms. Kayitesi Annonciata',   'a.kayitesi@ines.ac.rw',  3,'lecturer',       16,82,0.67,false),
  ('STF023','Mr. Dusabimana Clement',    'c.dusabimana@ines.ac.rw',6,'lecturer',       14,79,0.58,false),
  ('STF024','Ms. Abihigiro Nadine',      'n.abihigiro@ines.ac.rw', 2,'lecturer',       20,86,0.83,false),
  ('STF025','Mr. Nshimiyimana Bosco',    'b.nshimiyimana@ines.ac.rw',4,'lecturer',     18,71,0.75,false),
  ('STF026','Ms. Umulisa Josephine',     'j.umulisa@ines.ac.rw',   5,'lecturer',       16,85,0.67,false),
  ('STF027','Mr. Niyomugabo Albert',     'a.niyomugabo@ines.ac.rw',7,'lecturer',       12,80,0.50,false),
  ('STF028','Ms. Uwingabire Francine',   'f.uwingabire@ines.ac.rw',8,'lecturer',       18,83,0.75,false),
  ('STF029','Mr. Nkundimana Jean Claude','jc.nkundimana@ines.ac.rw',1,'admin',         0,87,0.60,false),
  ('STF030','Ms. Mukanzabashyitsi Grace','g.mukanza@ines.ac.rw',   3,'admin',          0,84,0.55,false)
ON CONFLICT (staff_id) DO NOTHING;

-- STUDENTS (50 representative students)
INSERT INTO students (student_id, full_name, email, dept_id, year_of_study, gpa, attendance, status) VALUES
  ('STU2024001','Irakoze Merveille',      'm.irakoze@std.ines.ac.rw',   1,2,3.45,92,'active'),
  ('STU2024002','Niyonsaba Emmanuel',     'e.niyonsaba@std.ines.ac.rw', 2,3,2.10,54,'at_risk'),
  ('STU2024003','Uwimana Beatrice',       'b.uwimana@std.ines.ac.rw',   3,1,3.71,96,'active'),
  ('STU2024004','Habimana Christian',     'c.habimana@std.ines.ac.rw',  4,4,2.85,78,'active'),
  ('STU2024005','Mukamana Claudette',     'c.mukamana@std.ines.ac.rw',  5,2,1.95,48,'at_risk'),
  ('STU2024006','Nzabonimana Pierre',     'p.nzabonimana@std.ines.ac.rw',1,3,3.20,85,'active'),
  ('STU2024007','Ingabire Stephanie',     's.ingabire@std.ines.ac.rw',  2,1,3.88,98,'active'),
  ('STU2024008','Hakizimana Theogene',    't.hakizimana@std.ines.ac.rw',3,4,2.40,61,'at_risk'),
  ('STU2024009','Uwase Chantal',          'c.uwase@std.ines.ac.rw',     6,2,3.55,90,'active'),
  ('STU2024010','Niyomugabo Jean Paul',   'jp.niyomugabo@std.ines.ac.rw',7,3,2.15,52,'at_risk'),
  ('STU2024011','Mukamurenzi Clarisse',   'c.mukamurenzi@std.ines.ac.rw',8,1,3.62,94,'active'),
  ('STU2024012','Bigirimana Patrick',     'p.bigirimana@std.ines.ac.rw',1,5,3.10,82,'active'),
  ('STU2024013','Nizeyimana Annette',     'a.nizeyimana@std.ines.ac.rw',2,2,2.75,71,'active'),
  ('STU2024014','Ndayisaba Fiston',       'f.ndayisaba@std.ines.ac.rw', 3,3,1.80,45,'at_risk'),
  ('STU2024015','Uwineza Prisca',         'p.uwineza@std.ines.ac.rw',   4,1,3.90,97,'active'),
  ('STU2024016','Nkurunziza Alphonse',    'a.nkurunziza@std.ines.ac.rw',5,4,2.60,68,'active'),
  ('STU2024017','Kayitesi Adeline',       'a.kayitesi@std.ines.ac.rw',  6,2,3.35,88,'active'),
  ('STU2024018','Nsengimana Faustin',     'f.nsengimana@std.ines.ac.rw',7,1,2.05,50,'at_risk'),
  ('STU2024019','Umulisa Leontine',       'l.umulisa@std.ines.ac.rw',   8,3,3.48,91,'active'),
  ('STU2024020','Havugimana Aime',        'a.havugimana@std.ines.ac.rw',1,2,2.90,75,'active'),
  ('STU2024021','Mukagasana Esperance',   'e.mukagasana@std.ines.ac.rw',2,4,3.72,95,'active'),
  ('STU2024022','Nzabonimpa Donatien',    'd.nzabonimpa@std.ines.ac.rw',3,1,1.70,42,'at_risk'),
  ('STU2024023','Abihigiro Vestine',      'v.abihigiro@std.ines.ac.rw', 4,5,3.15,83,'active'),
  ('STU2024024','Gahima Theophile',       't.gahima@std.ines.ac.rw',    5,3,2.80,77,'active'),
  ('STU2024025','Iradukunda Solange',     's.iradukunda@std.ines.ac.rw',6,2,3.60,93,'active'),
  ('STU2024026','Rukundo Celestin',       'c.rukundo@std.ines.ac.rw',   7,4,2.20,55,'at_risk'),
  ('STU2024027','Uwingabire Jacqueline',  'j.uwingabire@std.ines.ac.rw',8,1,3.80,96,'active'),
  ('STU2024028','Nkundimana Bonheur',     'b.nkundimana@std.ines.ac.rw',1,3,2.50,64,'active'),
  ('STU2024029','Mukanzabashyitsi Divine','d.mukanza@std.ines.ac.rw',   2,2,3.42,89,'active'),
  ('STU2024030','Ntaganda Dieudonne',     'd.ntaganda@std.ines.ac.rw',  3,5,1.60,38,'at_risk'),
  ('STU2024031','Ingabire Rosine',        'r.ingabire@std.ines.ac.rw',  4,1,3.65,94,'active'),
  ('STU2024032','Hakizumwami Fabrice',    'f.hakizumwami@std.ines.ac.rw',5,3,2.95,79,'active'),
  ('STU2024033','Uwimana Lydie',          'l.uwimana@std.ines.ac.rw',   6,4,3.28,86,'active'),
  ('STU2024034','Nshimiyimana Innocent',  'i.nshimiyimana@std.ines.ac.rw',7,2,1.90,47,'at_risk'),
  ('STU2024035','Dusabimana Aline',       'a.dusabimana@std.ines.ac.rw',8,1,3.55,92,'active'),
  ('STU2024036','Niyonzima Francois',     'f.niyonzima@std.ines.ac.rw', 1,4,2.70,72,'active'),
  ('STU2024037','Mukamurenzi Diane',      'd.mukamurenzi@std.ines.ac.rw',2,3,3.40,88,'active'),
  ('STU2024038','Bigirimana Valens',      'v.bigirimana@std.ines.ac.rw',3,2,2.25,58,'at_risk'),
  ('STU2024039','Nizeyimana Celine',      'c.nizeyimana@std.ines.ac.rw',4,5,3.70,95,'active'),
  ('STU2024040','Ndayisaba Christophe',   'c.ndayisaba@std.ines.ac.rw', 5,1,3.15,84,'active'),
  ('STU2024041','Uwineza Consolee',       'c.uwineza2@std.ines.ac.rw',  6,3,2.85,76,'active'),
  ('STU2024042','Nkurunziza Sylvie',      's.nkurunziza@std.ines.ac.rw',7,2,3.50,90,'active'),
  ('STU2024043','Kayitesi Henriette',     'h.kayitesi@std.ines.ac.rw',  8,4,2.40,62,'active'),
  ('STU2024044','Nsengimana Olivier',     'o.nsengimana@std.ines.ac.rw',1,1,1.75,44,'at_risk'),
  ('STU2024045','Umulisa Pascaline',      'p.umulisa@std.ines.ac.rw',   2,5,3.85,97,'active'),
  ('STU2024046','Havugimana Pacifique',   'p.havugimana@std.ines.ac.rw',3,3,2.60,69,'active'),
  ('STU2024047','Mukagasana Therese',     't.mukagasana@std.ines.ac.rw',4,2,3.30,87,'active'),
  ('STU2024048','Nzabonimana Christophe', 'c.nzabonimana@std.ines.ac.rw',5,4,2.10,51,'at_risk'),
  ('STU2024049','Abihigiro Gloriose',     'g.abihigiro@std.ines.ac.rw', 6,1,3.68,93,'active'),
  ('STU2024050','Gahima Jeannine',        'j.gahima@std.ines.ac.rw',    7,3,2.95,80,'active')
ON CONFLICT (student_id) DO NOTHING;

-- COURSES
INSERT INTO courses (code, name, dept_id, lecturer_id, students, pass_rate, avg_score, difficulty, semester) VALUES
  ('ENG301','Structural Engineering',          1,1,120,72.5,65.2,'hard',1),
  ('ENG201','Engineering Mathematics II',      1,6,145,68.0,61.8,'hard',1),
  ('MED401','Clinical Medicine',               2,2,98, 88.5,74.1,'medium',1),
  ('MED201','Anatomy & Physiology',            2,10,132,82.0,70.5,'medium',1),
  ('ICT301','Database Systems',                3,3,156,90.5,78.3,'medium',1),
  ('ICT401','Machine Learning',                3,9,89, 75.0,68.9,'hard',1),
  ('ICT201','Web Development',                 3,14,178,94.0,82.1,'easy',1),
  ('BUS301','Financial Management',            4,4,143,85.5,73.4,'medium',1),
  ('BUS201','Business Statistics',             4,11,167,78.0,67.2,'medium',1),
  ('AGR301','Soil Science & Crop Prod.',       5,5,112,87.0,75.6,'medium',1),
  ('AGR201','Agricultural Economics',          5,12,98, 91.5,79.8,'easy',1),
  ('EDU301','Curriculum Development',          6,7,134,92.0,80.2,'easy',1),
  ('LAW301','Constitutional Law',              7,8,89, 83.0,71.5,'medium',1),
  ('ENV301','Environmental Impact Assessment', 8,20,76, 88.5,76.3,'medium',1),
  ('ENG401','Final Year Project',              1,1,45, 65.0,58.4,'hard',1)
ON CONFLICT (code) DO NOTHING;

-- VISITORS
INSERT INTO visitors (full_name, purpose, host, gate, status, entry_time) VALUES
  ('Kagame Robert',        'Research collaboration','Dr. Nkurunziza Eric',  'Main Gate','oncampus', NOW() - INTERVAL '2 hours'),
  ('Uwimana Florence',     'Student visit',         'Irakoze Merveille',    'Main Gate','oncampus', NOW() - INTERVAL '1 hour'),
  ('Nkusi Jean Baptiste',  'Government inspection', 'VC Office',            'Main Gate','oncampus', NOW() - INTERVAL '30 minutes'),
  ('Murenzi Appolinaire',  'Equipment delivery',    'Facilities (DLABE)',   'Gate C',   'oncampus', NOW() - INTERVAL '45 minutes'),
  ('Bizimana Vestine',     'Parent visit',          'Uwimana Beatrice',     'Main Gate','oncampus', NOW() - INTERVAL '20 minutes'),
  ('Ndagijimana Pascal',   'Conference',            'DRDI Office',          'Main Gate','departed', NOW() - INTERVAL '3 hours'),
  ('Tuyisenge Aimable',    'Medical referral',      'Health Center',        'Main Gate','departed', NOW() - INTERVAL '4 hours'),
  ('Hakizimana Beatrice',  'Job interview',         'HRM Office',           'Gate D',   'departed', NOW() - INTERVAL '5 hours'),
  ('Unknown Person',       'Unknown',               'N/A',                  'Gate B',   'anomaly',  NOW() - INTERVAL '10 minutes'),
  ('Munyaneza Didier',     'Contractor work',       'Facilities (DLABE)',   'Gate C',   'oncampus', NOW() - INTERVAL '1 hour'),
  ('Uwamariya Christine',  'Academic partnership',  'DVCAR Office',         'Main Gate','oncampus', NOW() - INTERVAL '15 minutes'),
  ('Niyomugabo Eric',      'Sports event',          'Sports Director',      'Gate B',   'oncampus', NOW() - INTERVAL '35 minutes')
ON CONFLICT DO NOTHING;

-- SECURITY INCIDENTS
INSERT INTO incidents (incident_id, type, location, severity, status, reported_at) VALUES
  ('INC-2026-001','Unauthorized Entry',         'Gate B (North)',          'high',  'open',         NOW() - INTERVAL '9 minutes'),
  ('INC-2026-002','Equipment Malfunction',      'Lab C - ICT Block',       'medium','investigating', NOW() - INTERVAL '34 minutes'),
  ('INC-2026-003','Overcrowding',               'Main Library',            'low',   'open',         NOW() - INTERVAL '1 hour'),
  ('INC-2026-004','Power Outage',               'Engineering Block B',     'medium','resolved',     NOW() - INTERVAL '2 hours'),
  ('INC-2026-005','Theft Attempt',              'Hostel Block A',          'high',  'investigating', NOW() - INTERVAL '1 day'),
  ('INC-2026-006','Fire Alarm (False)',         'Cafeteria',               'low',   'resolved',     NOW() - INTERVAL '2 days'),
  ('INC-2026-007','Water Leak',                'Admin Block - 2nd Floor',  'medium','resolved',     NOW() - INTERVAL '3 days'),
  ('INC-2026-008','Vandalism',                 'Sports Pavilion',          'medium','resolved',     NOW() - INTERVAL '5 days')
ON CONFLICT (incident_id) DO NOTHING;

-- FINANCE
INSERT INTO finance (category, description, amount, type, period, recorded_at) VALUES
  ('tuition',        'Semester 1 2026 tuition fees',         1240000000, 'income',  '2026-S1', '2026-01-15'),
  ('tuition',        'Semester 2 2025 tuition fees',         1180000000, 'income',  '2025-S2', '2025-08-20'),
  ('government',     'Government annual grant',               420000000,  'income',  '2026',    '2026-01-05'),
  ('research',       'International research grants',         210000000,  'income',  '2026',    '2026-02-10'),
  ('other',          'Hostel fees & services',                185000000,  'income',  '2026-S1', '2026-01-20'),
  ('salary',         'Staff salaries - January 2026',         98000000,   'expense', '2026-01', '2026-01-31'),
  ('salary',         'Staff salaries - February 2026',        98000000,   'expense', '2026-02', '2026-02-28'),
  ('salary',         'Staff salaries - March 2026',           98000000,   'expense', '2026-03', '2026-03-31'),
  ('infrastructure', 'New lab wing construction - Phase 1',   180000000,  'expense', '2026-S1', '2026-02-15'),
  ('infrastructure', 'ICT equipment procurement',             45000000,   'expense', '2026-S1', '2026-01-25'),
  ('operations',     'Utilities - electricity & water Q1',    28000000,   'expense', '2026-Q1', '2026-03-31'),
  ('operations',     'Library resources & subscriptions',     12000000,   'expense', '2026-S1', '2026-01-10'),
  ('operations',     'Security services contract',            18000000,   'expense', '2026-Q1', '2026-03-31'),
  ('scholarships',   'Merit scholarships - Sem 1 2026',       62000000,   'expense', '2026-S1', '2026-02-01'),
  ('research',       'DRDI research operational costs',       35000000,   'expense', '2026-S1', '2026-02-20')
ON CONFLICT DO NOTHING;

-- RESEARCH PROJECTS
INSERT INTO research (title, dept_id, lead_staff_id, status, grant_amount, international, published_at) VALUES
  ('Impact of Climate Change on Rwandan Agriculture',           5,5,'published', 45000000,true, '2026-01-15'),
  ('AI-Driven Malaria Detection in Rural Rwanda',               2,2,'published', 78000000,true, '2026-02-20'),
  ('Smart Grid Energy Management for East Africa',              1,1,'ongoing',   62000000,true, NULL),
  ('E-Learning Adoption in Rwandan Higher Education',           6,7,'ongoing',   28000000,false,NULL),
  ('Blockchain for Land Registry in Rwanda',                    3,3,'published', 35000000,false,'2026-03-01'),
  ('Protein-Rich Crop Varieties for Nutrition Security',        5,12,'submitted',42000000,true, NULL),
  ('Constitutional Reform & Governance in East Africa',         7,8,'ongoing',   18000000,false,NULL),
  ('Wetland Ecosystem Services Valuation in Rwanda',            8,20,'published',31000000,true, '2025-12-10'),
  ('ICT Integration in Primary Schools',                        6,15,'ongoing',  22000000,false,NULL),
  ('Entrepreneurship Ecosystems in Rwandan SMEs',               4,4,'submitted', 25000000,false,NULL),
  ('Remote Sensing for Forest Cover Monitoring',                8,28,'ongoing',  38000000,true, NULL),
  ('Antimicrobial Resistance in Rwandan Hospitals',             2,24,'published',55000000,true, '2026-01-30'),
  ('Structural Load Analysis for Affordable Housing',           1,13,'ongoing',  29000000,false,NULL),
  ('Machine Learning for Crop Disease Detection',               3,14,'ongoing',  48000000,true, NULL),
  ('Financial Inclusion through Mobile Banking in Rwanda',      4,18,'submitted',20000000,false,NULL),
  ('Post-Harvest Losses Reduction Technologies',                5,19,'published',33000000,false,'2025-11-20'),
  ('Cybersecurity Frameworks for African Universities',         3,22,'ongoing',  41000000,true, NULL),
  ('Gender and STEM Participation in Rwandan Universities',     6,23,'submitted',15000000,false,NULL),
  ('Water Quality Monitoring using IoT Sensors',                8,20,'ongoing',  52000000,true, NULL),
  ('Telemedicine Adoption in Rural Healthcare',                 2,10,'published',44000000,true, '2026-02-14')
ON CONFLICT DO NOTHING;

-- FACILITIES
INSERT INTO facilities (name, type, capacity, occupancy, status, block) VALUES
  ('Main Library',         'library',   800, 624,'operational','Library Block'),
  ('Lecture Hall A1',      'classroom', 200, 190,'operational','Block A'),
  ('Lecture Hall A2',      'classroom', 200, 165,'operational','Block A'),
  ('Lecture Hall B1',      'classroom', 150, 142,'operational','Block B'),
  ('Lecture Hall B2',      'classroom', 150, 98, 'operational','Block B'),
  ('ICT Lab 1',            'lab',       60,  58, 'operational','ICT Block'),
  ('ICT Lab 2',            'lab',       60,  44, 'operational','ICT Block'),
  ('Engineering Lab C',    'lab',       40,  28, 'maintenance','Engineering Block'),
  ('Medical Simulation Lab','lab',      30,  26, 'operational','Medical Block'),
  ('Hostel Block A',       'hostel',    300, 287,'operational','Hostel Area'),
  ('Hostel Block B',       'hostel',    300, 265,'operational','Hostel Area'),
  ('Cafeteria',            'cafeteria', 400, 280,'operational','Central Area'),
  ('Sports Ground',        'sports',    500, 210,'operational','Sports Area'),
  ('Admin Block',          'admin',     100, 55, 'operational','Admin Block'),
  ('Research Center',      'lab',       80,  62, 'operational','DRDI Block')
ON CONFLICT DO NOTHING;

-- MAINTENANCE QUEUE
INSERT INTO maintenance (facility_id, item, priority, note, status) VALUES
  (8, 'Engineering Lab C - Ventilation system repair',       'high',  'AC unit failed, affecting 40 students', 'inprogress'),
  (10,'Hostel Block A - Plumbing on floor 3',                'high',  'Water leak reported, 12 rooms affected', 'pending'),
  (1, 'Main Library - 3 study room partitions',              'medium','Structural assessment required',         'pending'),
  (12,'Cafeteria - Kitchen exhaust fan replacement',         'medium','Energy efficiency issue',                'pending'),
  (4, 'Lecture Hall B1 - Projector replacement',             'medium','Bulb expired, backup in use',            'inprogress'),
  (13,'Sports Ground - Field lighting upgrade',              'low',   'Planned LED installation',               'pending'),
  (14,'Admin Block - Elevator maintenance',                  'low',   'Annual service due',                     'pending')
ON CONFLICT DO NOTHING;

-- ENERGY READINGS (last 8 months)
INSERT INTO energy (reading_kwh, source, recorded_at) VALUES
  (42800, 'grid',  '2025-09-30'),
  (45200, 'grid',  '2025-10-31'),
  (44100, 'grid',  '2025-11-30'),
  (38600, 'grid',  '2025-12-31'),
  (46800, 'grid',  '2026-01-31'),
  (48200, 'grid',  '2026-02-28'),
  (44900, 'grid',  '2026-03-31'),
  (2100,  'solar', '2026-03-31')
ON CONFLICT DO NOTHING;
