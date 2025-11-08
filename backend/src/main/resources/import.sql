INSERT INTO AppointmentEntity (
    id,
    start_date_time,
    duration_in_seconds,
    appointment_status,
    location,
    previous_appointment_id,
    patient_full_name,
    patient_email,
    patient_phone_number,
    patient_reason,
    clinician_notes,
    is_acknowledged,
    created_at,
    updated_at
) VALUES
(1, '2025-11-02 09:00:00', 1800, 'REQUESTED', '', NULL, 'Leslie Knope', 'leslie.knope@pawnee.gov', '1000000010', 'Persistent ringing in ears after years of attending Pawnee town hall meetings featuring loud booing and raccoon noises.', '', false, '2025-11-01 09:00:00', '2025-11-01 09:00:00'),
(2, '2025-11-02 09:30:00', 1800, 'REQUESTED', '', NULL, 'Dwight Schrute', 'dwight@dundermifflin.com', '1000000011', 'Claims ear damage from repeated fire drills and loud beet-harvester engines.', '', false, '2025-11-01 09:05:00', '2025-11-01 09:05:00'),
(3, '2025-11-02 10:00:00', 1800, 'REQUESTED', '', NULL, 'Michael Scott', 'michael.scott@dundermifflin.com', '1000000012', 'Reports “temporary hearing loss” after singing along too enthusiastically to his own karaoke rendition of “Take Me Home, Country Roads.”', '', false, '2025-11-01 09:10:00', '2025-11-01 09:10:00'),
(4, '2025-11-02 10:30:00', 1800, 'REQUESTED', '', NULL, 'Eleanor Shellstrop', 'eleanor@thegoodplace.com', '1000000013', 'Difficulty hearing moral lessons after centuries of being told she’s in “The Good Place.” Suspects it’s selective hearing.', '', false, '2025-11-01 09:15:00', '2025-11-01 09:15:00'),
(5, '2025-11-02 11:00:00', 1800, 'REQUESTED', '', NULL, 'Ron Swanson', 'ron.swanson@pawnee.gov', '1000000014', 'Complains of ringing ears caused by exposure to “government nonsense.” Refuses anesthesia or small talk.', '', false, '2025-11-01 09:20:00', '2025-11-01 09:20:00'),
(6, '2025-11-02 11:30:00', 1800, 'REQUESTED', '', NULL, 'Abed Nadir', 'abed@greendale.edu', '1000000015', 'Reports echoing voices “from another timeline” after binging six seasons and a movie worth of Greendale chaos.', '', false, '2025-11-01 09:25:00', '2025-11-01 09:25:00'),
(7, '2025-11-02 12:00:00', 1800, 'REQUESTED', '', NULL, 'Liz Lemon', 'liz.lemon@nbc.com', '1000000016', 'Mild tinnitus from years of headset usage and yelling “Where’s my sandwich?” across studio hallways.', '', false, '2025-11-01 09:30:00', '2025-11-01 09:30:00'),
(8, '2025-11-02 12:30:00', 1800, 'REQUESTED', '', NULL, 'Jean-Luc Picard', 'jl.picard@starfleet.org', '1000000017', 'Possible auditory fatigue from listening to constant bridge alerts and Wesley Crusher’s technobabble.', '', false, '2025-11-01 09:35:00', '2025-11-01 09:35:00'),
(9, '2025-11-02 13:00:00', 1800, 'REQUESTED', '', NULL, 'Moira Rose', 'moira.rose@schittscreek.tv', '1000000018', 'Reports “aural exhaustion” after marathon rehearsal of her own vocabulary. Insists treatment includes champagne.', '', false, '2025-11-01 09:40:00', '2025-11-01 09:40:00'),
(10, '2025-11-02 13:30:00', 1800, 'REQUESTED', '', NULL, 'Tobias Fünke', 'tobias.funke@bluthco.com', '1000000019', 'Claims partial deafness from repeated use of blue body paint and emotional trauma during “auditions.”', '', false, '2025-11-01 09:45:00', '2025-11-01 09:45:00');

-- Reset sequence to next available ID
ALTER SEQUENCE AppointmentEntity_seq RESTART WITH 11;
