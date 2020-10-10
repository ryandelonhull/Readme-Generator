const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");


const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title of the project?",
    },
    {
      type: "input",
      name: "description",
      message: "How would you describe this project?",
    },
    {
      type: "input",
      name: "installation",
      message: "How do you install this application?",
    },
    {
      type: "input",
      name: "usage",
      message: "How is this application used?",
    },
    {
      type: "input",
      name: "license",
      message:
        "Who is this licensed by? Press 1 for MIT, 2 for Apache, 3 for Boost.",
    },
    {
      type: "input",
      name: "contributing",
      message: "Who else contributed to this project?",
    },
    {
      type: "input",
      name: "tests",
      message: "What commands should be run to run tests for this project?",
    },
    {
      type: "input",
      name: "questions",
      message: "Any questions?",
    },
    {
      type: "input",
      name: "email",
      message: "what is your email address?",
    },
    {
      type: "input",
      name: "github",
      message: "what is your github username?",
    },
  ]);
}

function generateHTML(answers) {
  return `
# ${answers.title}

#### ${answers.description}



## Table of Contents
- Installation
- Usage
- License
- Contributing
- Tests
- Questions
- GitHub email
- GitHub Profile Picture



## Installation 

#### ${answers.installation}



## Usage

#### ${answers.usage}



## License

#### This project is licensed under ${answers.licenseBadge}



## Contributing

#### ${answers.contributing}



## Tests

#### ${answers.tests}



## Questions

#### ${answers.questions}



## Email address

#### ${answers.email} 


![github-thumbnail-image](${answers.avatar_url})
 `;
}

async function init() {
  try {
    const answers = await promptUser();
  
    if (answers.license === "1") {
      answers.licenseBadge =
        "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)";
    } else if (answers.license === "2") {
      answers.licenseBadge =
        "[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)";
    } else if (answers.license === "3") {
      answers.licenseBadge =
        "[![License](https://img.shields.io/badge/License-Boost%201.0-lightblue.svg)](https://www.boost.org/LICENSE_1_0.txt)";
    } else {
      answers.licenseBadge = "err";
    }
    const queryUrl = "https://api.github.com/users/" + (answers.github);
    //answers.avatar_url = "foo";
    // axios.get(queryUrl)
    // .then(function(response){
    //     console.log(response.data);
    //     answers.avatar_url = response.data.avatar_url;


    // })
    // .catch(function(error){
    //     console.log(error);
    // });

 
        try {
          const response = await axios.get(queryUrl);
          answers.avatar_url = response.data.avatar_url;
          console.log(response);
        } catch (error) {
          console.error(error);
        }
      
    const html = generateHTML(answers);

    await writeFileAsync("README.md", html);



    console.log("Successfully wrote to README.md");
  } catch (err) {
    console.log(err);
  }
}

init();
