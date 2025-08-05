-- Migration to update Projects table with additional fields
-- Run this SQL script to add missing columns to the Projects table

USE womenconnect;

-- Add missing columns to Projects table
ALTER TABLE Projects 
ADD COLUMN email VARCHAR(100) NOT NULL DEFAULT '',
ADD COLUMN category VARCHAR(100) NOT NULL DEFAULT '',
ADD COLUMN country VARCHAR(100) NOT NULL DEFAULT '',
ADD COLUMN fundingGoal INT NOT NULL DEFAULT 0,
ADD COLUMN timeline VARCHAR(50),
ADD COLUMN teamSize INT DEFAULT 1,
ADD COLUMN videoUrl VARCHAR(500),
ADD COLUMN businessPlan VARCHAR(500),
ADD COLUMN targetMarket TEXT,
ADD COLUMN competitiveAdvantage TEXT,
ADD COLUMN previousExperience VARCHAR(100),
ADD COLUMN status ENUM('draft', 'active', 'completed', 'cancelled') DEFAULT 'draft',
ADD COLUMN entrepreneur JSON;

-- Modify existing columns to match the model
ALTER TABLE Projects 
MODIFY COLUMN title VARCHAR(200) NOT NULL,
MODIFY COLUMN description TEXT NOT NULL,
MODIFY COLUMN location VARCHAR(100) NOT NULL,
MODIFY COLUMN imageUrl VARCHAR(500);

-- Add foreign key constraint for userId
ALTER TABLE Projects 
ADD CONSTRAINT fk_projects_user 
FOREIGN KEY (userId) REFERENCES Users(id) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- Show the updated table structure
DESCRIBE Projects;
