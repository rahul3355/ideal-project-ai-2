import "./App.css";
import React, { useState } from "react";
import axios from "axios";
import ProjectForm from "./components/ProjectForm";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateProjectIdea = async (formData, setProjectIdea, setLoading, retries = 5) => {
  const prompt = `
  Generate a perfect project solving a real-world issue with respect to the job description. The project should make the candidate a strong hire for the company. It should demonstrate all the technical skills mentioned in the job description. Write in bullet points and as a step-by-step tutorial. Start with a project overview, then list the key features. Then, a detailed 10-step process. Use bullet points for details within each step. End with a list of tools and technologies used.

  Format the response as follows:
  - Begin with "Project Overview:" followed by a brief explanation.
  - Next, list "Key Features:" of the project, each on a new line and numbered.
  - Next, list "Steps" of the project, each on a new line and numbered.
  - List the tools and technologies used at the end under the heading "TOOLS & TECHNOLOGIES:" without any markdown or asterisks.
  
  Maintain this structure throughout the response. Avoid using markdown syntax for bold, and ensure each bullet point is on a new line.
  Write in a copy-paste version. Don't make anything bold.
  This is the job description: ${formData.jobDescription}
  `;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an extremely intelligent engineer.",
          },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const botMessage = response.data.choices[0].message.content;
    setProjectIdea(botMessage);
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      const retryAfter = error.response.headers["retry-after"]
        ? parseInt(error.response.headers["retry-after"]) * 1000
        : 2000;
      console.warn(`Rate limit hit, retrying after ${retryAfter}ms...`);
      await delay(retryAfter);
      return generateProjectIdea(formData, setProjectIdea, setLoading, retries - 1);
    } else {
      console.error("Error generating project idea: ", error);
    }
  } finally {
    setLoading(false);
  }
};

const ParagraphCard = ({ children }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg my-4">
    {children}
  </div>
);

const ProjectIdeaDisplay = ({ idea }) => {
  const sections = idea.split(/(Project Overview:|Key Features:|Steps:|TOOLS & TECHNOLOGIES:)/);

  const combinedSections = [];
  for (let i = 1; i < sections.length; i += 2) {
    combinedSections.push(sections[i] + sections[i + 1]);
  }

  return (
    <div>
      
      {combinedSections.map((section, index) => {
        const [title, content] = section.split(':', 2);
        const formattedContent = ["Key Features", "Steps"].includes(title.trim())
          ? content
              .trim()
              .split(/\d+\.\s+/)
              .filter((item) => item.trim() !== "")
              .map((item, i) => <li key={i}>{item.trim()}</li>)
          : content.trim();

        return (
          <ParagraphCard key={index}>
            <h4>{title.trim()}</h4>
            {["Key Features", "Steps"].includes(title.trim()) ? (
              <ul>{formattedContent}</ul>
            ) : (
              <p>{formattedContent}</p>
            )}
          </ParagraphCard>
        );
      })}
    </div>
  );
};

function App() {
  const [projectIdea, setProjectIdea] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateProjectIdea = (formData) => {
    setLoading(true);
    generateProjectIdea(formData, setProjectIdea, setLoading);
  };

  return (
    <div className="App container mx-auto px-4">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
          integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N"
          crossOrigin="anonymous"
        />
        <script
          src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
          integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-Fy6S3B9q64WdZWQUiU+q4/2Lc9npb8tCaSX9FK7E8HnRr0Jz8D6OP9dO5Vg3Q9ct"
          crossOrigin="anonymous"
        ></script>
      </head>
      <ProjectForm onSubmit={handleGenerateProjectIdea} />
      {loading && (
        <div className="loading-spinner"></div>
    
      )}
      <div className="GeneratedProjectIdea">
        <ProjectIdeaDisplay idea={projectIdea} />
      </div>
    </div>
  );
}

export default App;
