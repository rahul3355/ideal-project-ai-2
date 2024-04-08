import React, {useState} from "react";



const ProjectForm = ({onSubmit}) =>{
    const [formData, setFormData] = useState({
        jobDescription: '',
        skills: '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({...prevState, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData)
    }

    return(
        <form onSubmit={handleSubmit}>
            <input
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Job Description"
            required
            />

            <button type="submit">Generate Project Idea</button>
        </form>
    );
}

export default ProjectForm;