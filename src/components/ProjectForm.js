import React, { useState } from "react";

const ProjectForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    jobDescription: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
    <h1>Project Idea Generator</h1>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="exampleFormControlTextarea1">
          Copy-Paste the job description below
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          placeholder="Job Description"
          required
        />
      </div>
      <button type="submit">Generate Project Idea</button>
    </form>
    </>
  );
};

export default ProjectForm;
