"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { redirect } from "next/navigation";
import StudentForm from "@/components/AccountForm/Student";
import FacultyForm from "@/components/AccountForm/Faculty";

const AccountForm = ({
  user = {},
  skills = [],
  userUpdate,
  hideInstruction,
}) => {
  const [formData, setFormData] = useState(() => {
    const data = {};
    if (user.student) {
      const { firstName, lastName, major, minor, skills } = user.student;
      data.name = `${firstName || ""} ${lastName || ""}`;
      data.major = major || "";
      data.minor = minor || "";
      data.skills = skills?.map((skill) => skill.skill.name) || [];
    }
    if (user.faculty) {
      const {
        firstName,
        lastName,
        department,
        bio,
        researchInterests,
        expertiseAreas,
        skills,
      } = user.faculty;
      data.name = `${firstName || ""} ${lastName || ""}`;
      data.department = department || "";
      data.bio = bio || "";
      data.researchInterests = researchInterests || "";
      data.expertiseAreas = expertiseAreas || "";
      data.skills = skills?.map((skill) => skill.skill.name) || [];
    }
    return data;
  });

  // track input for skills
  const [skillInput, setSkillInput] = useState("");

  // State for profile picture
  const [profilePicture, setProfilePicture] = useState(user.profilePictureUrl);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle input for skills
  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  // add the skill to the list when "Enter" is pressed
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault(); // prevent form submission
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput(""); // clear the input after adding
    }
  };

  // remove a skill with the 'x'
  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
    }
  };

  if (user.student) {
    return (
      <StudentForm
        profilePicture={profilePicture}
        handleFileChange={handleFileChange}
        user={user}
        formData={formData}
        userUpdate={userUpdate}
        handleInputChange={handleInputChange}
        skillInput={skillInput}
        handleSkillInputChange={handleSkillInputChange}
        handleSkillKeyDown={handleSkillKeyDown}
        handleRemoveSkill={handleRemoveSkill}
        hideInstruction={hideInstruction}
        skills={skills}
      />
    );
  }

  if (user.faculty) {
    return (
      <FacultyForm
        user={user}
        userUpdate={userUpdate}
        formData={formData}
        hideInstruction={hideInstruction}
        handleFileChange={handleFileChange}
        profilePicture={profilePicture}
        handleInputChange={handleInputChange}
        skillInput={skillInput}
        handleSkillInputChange={handleSkillInputChange}
        handleSkillKeyDown={handleSkillKeyDown}
        handleRemoveSkill={handleRemoveSkill}
        skills={skills}
      />
    );
  }

  redirect("/");
};

AccountForm.propTypes = {
  user: PropTypes.object.isRequired,
  skills: PropTypes.array,
  userUpdate: PropTypes.func.isRequired,
  hideInstruction: PropTypes.bool,
};

export default AccountForm;
