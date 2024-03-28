import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import axios from 'axios';
import ProjectForm from './components/ProjectForm'


function App() {
  const [projectIdea, setProjectIdea] = useState('')

  const generateProjectIdea = async(formData) => {
    const prompt = `Generate a project idea involving ${formData.jobDescription} with skills in ${formData.skills}.`;

    try{
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {role: 'system', content: 'you are a helpful assistant.'},
            {role: 'user', content: prompt},
          ],
        },
        {
          headers:{
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          }
        }
      );
      const botMessage = response.data.choices[0].message.content;
      setProjectIdea(botMessage);
    }
    catch(error){
      console.error('Error generating project idea: ', error);
    }
  }

  return (
    <div>
      <ProjectForm onSubmit={generateProjectIdea}/>
      <div>
        <h3>Generated Project Idea: </h3>
        <p>{projectIdea}</p>
      </div>
    </div>
  );
}

export default App;
