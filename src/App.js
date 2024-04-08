import "./App.css";
import React, { useState } from "react";
import axios from "axios";
import ProjectForm from "./components/ProjectForm";

function App() {
  const [projectIdea, setProjectIdea] = useState("");

  const generateProjectIdea = async (formData) => {
    const prompt = `
    
    Generate a perfect project solving a real-world issue with respect to the job description. The project should make the candidate a strong hire for the company. It should demonstrate all the technical skills mentioned in the job description. Write in bullet points and as a step-by-step tutorial. Start with a project overview, then list the key features. Then, a detailed 10-step process. Use bullet points for details within each step. End with a list of tools and technologies used.

  Format the response as follows:
  - Begin with "Project Overview:" followed by a brief explanation.
  - Next, list "Key Features:" of the project.
  - Next, list "Steps" of the project
  - List the tools and technologies used at the end under the heading "TOOLS & TECHNOLOGIES:" without any markdown or asterisks.
  
  Maintain this structure throughout the response. Avoid using markdown syntax for bold, and ensure each bullet point is on a new line.
    Write in a copy-paste version. Dont make anything bold.
  This is the job description: ${formData.jobDescription}
  
  
  Adhere to this format strictly.`;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "you are an extremely intelligent engineer.",
            },
            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      const botMessage = response.data.choices[0].message.content;
      setProjectIdea(botMessage);
    } catch (error) {
      console.error("Error generating project idea: ", error);
    }
  };

  const ParagraphCard = ({ children }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg my-4">
      {children}
    </div>
  );


  const ProjectIdeaDisplay = ({ idea }) => {
    // Split the idea by the titles
    const sections = idea.split(/(Project Overview:|Key Features:|Steps:|TOOLS & TECHNOLOGIES:)/);
  
    // Combine each title with its corresponding paragraph
    const combinedSections = [];
    for (let i = 1; i < sections.length; i += 2) {
      combinedSections.push(sections[i] + sections[i + 1]);
    }
  
    return (
      <div>
        {combinedSections.map((section, index) => (
          <ParagraphCard key={index}>
            <h4>{section.split(':')[0]}</h4>
            <p>{section.substring(section.indexOf(':') + 1)}</p>
          </ParagraphCard>
        ))}
      </div>
    );
  };

  

  return (
    <div className="App container mx-auto px-4">
      <ProjectForm onSubmit={generateProjectIdea} />
      <div className="GeneratedProjectIdea">
        <h3 className="text-2xl font-bold underline mb-4">Generated Project Idea:</h3>
        <ProjectIdeaDisplay idea={projectIdea} />
      </div>
    </div>
  );
}

export default App;
