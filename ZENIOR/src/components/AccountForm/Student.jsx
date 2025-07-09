"use client";

import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react"; // importing camera icon from Lucide icons
import styles from "@/styles/StudentAccountForm.module.css";
import { redirect } from "next/navigation";
import Image from "next/image";

const StudentForm = ({
  profilePicture,
  handleFileChange,
  user,
  formData,
  userUpdate,
  handleInputChange,
  skillInput,
  handleSkillInputChange,
  handleSkillKeyDown,
  handleRemoveSkill,
  hideInstruction,
  skills,
}) => {
  return (
    <div className={styles.container}>
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
              Student: {
                firstName: formData.name.split(" ")[0],
                lastName: formData.name.split(" ")[1],
                major: formData.major,
                minor: formData.minor,
                skills: formData.skills,
              },
            });
            if (window.location.pathname === "/success/new-user") {
              redirect("/my-profile");
            }
          }}
        >
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Enter First and Last Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <div className={styles.selectContainer}>
            <label htmlFor="major" className={styles.label}>
              Major
            </label>
            <select
              className={styles.select}
              name="major"
              value={formData.major}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Your Major</option>
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
          </div>

          <div className={styles.selectContainer}>
            <label htmlFor="minor" className={styles.label}>
              Minor
            </label>
            <input
              className={styles.input}
              type="text"
              name="minor"
              placeholder="Minor(s)"
              value={formData.minor}
              onChange={handleInputChange}
            />
          </div>

          {/* Skills input box */}
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
            {user.new ? "Create Account" : "Update Account"}
          </Button>
        </form>
      </div>
      {/* Conditionally rendering the instruction text */}
      {!hideInstruction && (
        <div className={styles.instructionContainer}>
          <p className={styles.instructionText}>
            Enter your information on the left to finish setting up your
            account.
          </p>
        </div>
      )}
    </div>
  );
};

StudentForm.propTypes = {
  styles: PropTypes.object.isRequired,
  profilePicture: PropTypes.string,
  handleFileChange: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  userUpdate: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  skillInput: PropTypes.string.isRequired,
  handleSkillInputChange: PropTypes.func.isRequired,
  handleSkillKeyDown: PropTypes.func.isRequired,
  handleRemoveSkill: PropTypes.func.isRequired,
  hideInstruction: PropTypes.bool,
  skills: PropTypes.array.isRequired,
};

export default StudentForm;
