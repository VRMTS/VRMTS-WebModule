USE vrmts;

-- Additional tables for user settings not in original schema

CREATE TABLE UserPreferences (
    preferenceId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL UNIQUE,
    theme VARCHAR(20) DEFAULT 'dark',
    language VARCHAR(10) DEFAULT 'en',
    timeZone VARCHAR(50) DEFAULT 'UTC+05:00',
    dateFormat VARCHAR(20) DEFAULT 'MM/DD/YYYY',
    defaultView VARCHAR(20) DEFAULT 'grid',
    phone VARCHAR(20),
    institution VARCHAR(255),
    bio TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE UserAccessibility (
    accessibilityId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL UNIQUE,
    textSize INT DEFAULT 16,
    highContrast BOOLEAN DEFAULT FALSE,
    reduceMotion BOOLEAN DEFAULT FALSE,
    screenReader BOOLEAN DEFAULT FALSE,
    keyboardNav BOOLEAN DEFAULT TRUE,
    captions BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE UserNotifications (
    notificationId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL UNIQUE,
    assignments BOOLEAN DEFAULT TRUE,
    quizDeadlines BOOLEAN DEFAULT TRUE,
    performance BOOLEAN DEFAULT TRUE,
    announcements BOOLEAN DEFAULT FALSE,
    emailDigest VARCHAR(20) DEFAULT 'weekly',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add some sample data for testing
INSERT INTO UserPreferences (userId, theme, language) VALUES (3, 'dark', 'en');
INSERT INTO UserAccessibility (userId) VALUES (3);
INSERT INTO UserNotifications (userId) VALUES (3);
