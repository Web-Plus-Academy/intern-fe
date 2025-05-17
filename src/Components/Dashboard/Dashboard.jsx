import React, { useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ userDetails }) => {

  const getDomainName = (internID) => {
    if (!internID) return "Unknown"; // Handle cases where ID is undefined

    // Extract the domain code (assumes first 6 characters represent the domain)
    const domainCode = internID.substring(0, 6);

    // Map domain codes to domain names
    const domainMap = {
      "SWPAWD": "Web Development",
      "SWPAAD": "Mobile App Development",
      "SWPAAI": "Artificial Intelligence (AI)",
      "SWPAML": "Machine Learning (ML)",
      "SWPADS": "Data Science",
      "SWPACS": "Cybersecurity",
      "SWPACC": "Cloud Computing & DevOps",
      "SWPASD": "Software Development",
      "SWPAUI": "UI/UX Design",
      "SWPADM": "Digital Marketing",
      "SWPABT": "Blockchain Technology",
      "SWPAIT": "Internet of Things (IoT)",
      "SWPAES": "Embedded Systems",
      "SWPAGD": "Game Development",
      "SWPAAR": "AR/VR Development",
      "SWPACN": "Computer Networking & System Administration",
      "SWPAAU": "Automation & Robotics",
      "SWPADB": "Database Management",
      "SWPAST": "Software Testing & Quality Assurance",
      "SWPABD": "Big Data Analytics"
    };

    // Return the corresponding domain name or "Unknown" if not found
    return domainMap[domainCode] || "Unknown";
  };


  useEffect(() => {
    const card = document.querySelector('.dashboard-container');
    const body = document.querySelector('.body');

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = body.getBoundingClientRect();

      const xRotation = ((clientY - top) / height - 0.5) * 30;
      const yRotation = ((clientX - left) / width - 0.5) * 30;

      card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    };

    body.addEventListener('mousemove', handleMouseMove);

    return () => {
      body.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className='body'>
      <div className="dashboard-container">
        <h4 className="dashboard-welcome">Welcome,</h4>
        <h1 className="dashboard-name">{userDetails.name}</h1>
        <p className="dashboard-id">ID: {userDetails.ID}</p>
        <p className="dashboard-domain">Domain: {getDomainName(userDetails.ID)}</p>
      </div>
    </div>

  );
};

export default Dashboard;
