"use client";

import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react"; // importing camera icon from Lucide icons
import styles from "@/styles/FacultyAccountForm.module.css";
import { redirect } from "next/navigation";
import Image from "next/image";

const FacultyForm = ({
  user,
  userUpdate,
  hideInstruction,
  handleFileChange,
  profilePicture,
  handleInputChange,
  formData,
  skillInput,
  handleSkillInputChange,
  handleSkillKeyDown,
  handleRemoveSkill,
  skills,
}) => {
  return (
    <div className={styles.container}>
      {/* Conditionally rendering the instruction text */}
      {!hideInstruction && (
        <div className={styles.instructionContainer}>
          <p className={styles.instructionText}>
            Enter your information below to finish setting up your account.
          </p>
        </div>
      )}
      <div className={styles.formCard}>
        <div className={styles.avatarContainer}>
          <Avatar className="w-32 h-32">
            <AvatarImage src={profilePicture} alt="Your profile picture" />
            <AvatarFallback>
              <Image
                src={profilePicture || "/images/default-avatar.png"}
                width={128}
                height={128}
                alt="Your profile picture"
              />
            </AvatarFallback>
          </Avatar>
          <label htmlFor="profile-upload" className={styles.cameraIcon}>
            <Camera />
          </label>
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </div>

        <form
          action={() => {
            userUpdate(user.id, {
              new: false,
              Faculty: {
                firstName: formData.name.split(" ")[0],
                lastName: formData.name.split(" ")[1],
                department: formData.department,
                bio: formData.bio,
                researchInterests: formData.researchInterests,
                expertiseAreas: formData.expertiseAreas,
                skills: formData.skills,
              },
            });
            redirect("/my-profile");
          }}
        >
          <input
            className={styles.input}
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.name.split(" ")[0]}
            onChange={handleInputChange}
            required
          />

          <input
            className={styles.input}
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.name.split(" ")[1]}
            onChange={handleInputChange}
            required
          />

          <select
            className={styles.select}
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
          >
            <option value="">Please select department</option>
            <option value="csen">Computer Science and Engineering</option>
            <option value="bioe">Bioengineering</option>
            <option value="mech">Mechanical Engineering</option>
            <option value="web">Web Design and Engineering</option>
            <option value="civil">
              Civil, Environmental, and Sustainable Engineering
            </option>
            <option value="ecen">Electrical and Computer Engineering</option>
            <option value="gen">General Engineering</option>
          </select>

          {/* biography portion */}
          <label className={styles.label}> Biography: </label>
          <textarea
            className={styles.textarea}
            name="bio"
            placeholder="Write a brief bio to introduce yourself to students."
            defaultValue={formData.bio}
            onChange={handleInputChange}
          />

          {/* research interests portion */}
          <label className={styles.label}> Research Interests: </label>
          <textarea
            className={styles.textarea}
            name="researchInterests"
            placeholder="Enter research interests"
            value={formData.researchInterests}
            onChange={handleInputChange}
          />

          {/* areas of expertise portion */}
          <label className={styles.label}> Areas of Expertise: </label>
          <textarea
            className={styles.textarea}
            name="expertiseAreas"
            placeholder="Enter areas of expertise"
            value={formData.expertiseAreas}
            onChange={handleInputChange}
          />

          {/* Skills input box */}
          <label className={styles.label}> Skills: </label>
          <div className={styles.skillsInputContainer}>
            <input
              className={styles.input}
              type="text"
              name="skills"
              placeholder="Type your skills and press Enter"
              value={skillInput}
              onChange={handleSkillInputChange}
              onKeyDown={handleSkillKeyDown}
              list="skills"
            />
            <datalist id="skills">
              {skills.map((skill) => (
                <option key={skill.id} value={skill.name} />
              ))}
            </datalist>
          </div>

          {/* Skills list below the input */}
          <div className={styles.skillsContainer}>
            {formData.skills.map((skill, index) => (
              <div key={index} className={styles.skillTag}>
                {skill}{" "}
                <span
                  onClick={() => handleRemoveSkill(skill)}
                  className={styles.removeSkill}
                >
                  x
                </span>
              </div>
            ))}
          </div>

          <Button variant="custom">
            {user.new ? "Create Profile" : "Update Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};

FacultyForm.propTypes = {
  user: PropTypes.object.isRequired,
  userUpdate: PropTypes.func.isRequired,
  hideInstruction: PropTypes.bool,
  handleFileChange: PropTypes.func.isRequired,
  profilePicture: PropTypes.string,
  handleInputChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
  skillInput: PropTypes.string.isRequired,
  handleSkillInputChange: PropTypes.func.isRequired,
  handleSkillKeyDown: PropTypes.func.isRequired,
  handleRemoveSkill: PropTypes.func.isRequired,
  skills: PropTypes.array.isRequired,
};

export default FacultyForm;
