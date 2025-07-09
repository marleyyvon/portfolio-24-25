import PropTypes from "prop-types";

const Projects = ({ projects }) => {
  return (
    <>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

Projects.propTypes = {
  projects: PropTypes.array,
};

export default Projects;
