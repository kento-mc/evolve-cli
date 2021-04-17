#!/usr/bin/env node
const { exec } = require("child_process");
const prompt = require('prompt-sync')({sigint: true});
const fs = require('fs');
const path = require('path');

const tempProjectsArray = [
  {
    "name": "Test Name",
    "slug": "test-name"
  },
  {
    "name": "Test Name 2",
    "slug": "test-name-2"
  }
];

if (typeof process.argv[2] === 'undefined') {
  console.log('you are evolving');
  // present menu of evolve options
} else if (process.argv[2] === 'new') {
  // check for/install docker & docker-compose

  // capture project name from user prompt
  console.log('');
  const projectName = prompt('Please give your project a name: ');
  
  // transform project name to lower-case string with dashes in place of white space
  formattedProjectName = projectName.replace(/\s+/g, '-').toLowerCase();

  const newProject = {
    name: projectName,
    slug: formattedProjectName,
  };

  // add new project to list of projects
  let projectsData = fs.readFileSync(path.resolve(__dirname, 'projects.json'));
  let projects = JSON.parse(projectsData);
  console.log(projects)
  projects.push(newProject);
  fs.writeFileSync(path.resolve(__dirname, 'projects.json'), JSON.stringify(projects));

  console.log(`\nCreated new project: ${newProject.name}\nSetting up project repositories...`);

  // create project directory structure
  exec(`mkdir ${formattedProjectName}; cd ${formattedProjectName};\
    mkdir ${formattedProjectName}-client; mkdir ${formattedProjectName}-backend`, (error, stdout, stderr) => {
    if (error || stderr) {
      error && console.log(`error: ${error.message}`);
      stderr && console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  // copy files

  // // bootstrap new next app from evolve-next-starter repo  
  // exec(`npm i create-next-app; npx create-next-app ${projectName} \
  //      -e https://github.com/kento-mc/evolve-next-starter`, (error, stdout, stderr) => {
  //   if (error) {
  //       console.log(`error: ${error.message}`);
  //       return;
  //   }
  //   if (stderr) {
  //       console.log(`stderr: ${stderr}`);
  //       return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  // });

  // create client image
} else if (process.argv[2] === 'run') {
  let projectsData = fs.readFileSync(path.resolve(__dirname, 'projects.json'));
  let projects = JSON.parse(projectsData);

  if (typeof process.argv[3] === 'undefined') {
    // display list of evolve projects
    if (projects.length > 1) {
      console.log('\nWhich project would you like to run?');
      projects.forEach((project, i) => {
        console.log(`  ${i+1}) ${project.name}`)
      });
      const option = prompt('====> ');
      // TODO finish options
      console.log(`\nYou chose option ${option}`)
    }

  } else if (projects.includes(process.argv[3])) {
    console.log(`Launching ${process.argv[3]} project`);
    // spin up project
  } else {
    console.log('no such project');
  };
} else if (process.argv[2] === 'list') {
  // display list of evolve projects
  let projectsData = fs.readFileSync(path.resolve(__dirname, 'projects.json'));
  let projects = JSON.parse(projectsData);

  console.log('\nEvolve projects');
  projects.forEach((project, i) => {
    console.log(`  ${i+1}) ${project.name}`)
  });
  console.log('\nEnter prjoject number for more options');
  const option = prompt('====> ');
  // TODO finish options
  console.log(`\nYou chose option ${option}`)

}else {
  console.log(`command "${process.argv[2]}" not recognized!`);
};


// spin up containers
// wp cli install wordpress
// evolve child enter theme details
// wp scaffold child-theme
// wp cli install/activate theme/plugin
// initialize next
// launch browser windows






  // exec(``, (error, stdout, stderr) => {
  //   if (error) {
  //       console.log(`error: ${error.message}`);
  //       return;
  //   }
  //   if (stderr) {
  //       console.log(`stderr: ${stderr}`);
  //       return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  // });