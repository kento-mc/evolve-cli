#!/usr/bin/env node
const { exec, execSync } = require("child_process");
const prompt = require('prompt-sync')({sigint: true});
const fs = require('fs');
const path = require('path');
const degit = require('degit')

let projectsData;
let projects;

switch (process.argv[2]) {
  case undefined:
    console.log('you are evolving');
    // present menu of evolve options
    break;
  case 'new':
    // check for/install docker & docker-compose
    execSync(`npm i docker docker-compose degit`, (error, stdout, stderr) => {
      if (error || stderr) {
        error && console.log(`error: ${error.message}`);
        stderr && console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });

    // capture project name from user prompt
    console.log('');
    const projectName = prompt('Please give your project a name: ');
    
    // transform project name to lower-case string with dashes in place of white space
    const formattedProjectName = projectName.replace(/\s+/g, '-').toLowerCase();
    const projectContainerName = projectName.replace(/\s+/g, '_').toLowerCase(); 

    const newProject = {
      name: projectName,
      slug: formattedProjectName,
      container: projectContainerName
    };

    // add new project to list of projects
    projectsData = fs.readFileSync(path.resolve(__dirname, 'projects.json'));
    projects = JSON.parse(projectsData);
    console.log(projects)
    projects.push(newProject);
    fs.writeFileSync(path.resolve(__dirname, 'projects.json'), JSON.stringify(projects));

    console.log(`\nCreated new project: ${newProject.name}\nSetting up project repositories...`);

    // create project directory structure
    execSync(`mkdir ${formattedProjectName}; cd ${formattedProjectName};\
      mkdir ${formattedProjectName}-client; mkdir ${formattedProjectName}-backend;\
      cd ${formattedProjectName}-backend; degit kento-mc/evolve-wordpress-starter`, (error, stdout, stderr) => {
      if (error || stderr) {
        error && console.log(`error: ${error.message}`);
        stderr && console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });

    // // rename plugin TODO also change theme data
    // execSync(`cd ${formattedProjectName}/${formattedProjectName}-backend/wordpress/plugins; \
    //   mv evolve-api ${formattedProjectName}-api`, (error, stdout, stderr) => {
    //   if (error || stderr) {
    //     error && console.log(`error: ${error.message}`);
    //     stderr && console.log(`stderr: ${stderr}`);
    //     return;
    //   }
    //   console.log(`stdout: ${stdout}`);
    // })
    
    // spin up wordpress container
    execSync(`cd ${formattedProjectName}/${formattedProjectName}-backend; \
      CONTAINER_NAME=${projectContainerName} docker-compose up -d`, (error, stdout, stderr) => {
      if (error || stderr) {
        error && console.log(`error: ${error.message}`);
        stderr && console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });

    // prompt for wp username, password, email address
    console.log('');
    const wpAdmin = prompt('Please create a WordPress admin user name: ');
    const wpPassword = prompt('Please create a WordPress admin password: ');
    const wpEmail = prompt('Please enter a WordPress admin email address: ');

    // run wordpress install
    console.log('');
    console.log('Installing Wordpress...');
    execSync(`sleep 10; docker run --rm --user 33 --volumes-from ${projectContainerName}_wordpress \
      --network container:${projectContainerName}_wordpress wordpress:cli wp core install \
      --url=localhost:8000 \
      --title=${formattedProjectName}-backend \
      --admin_user=${wpAdmin} \
      --admin_password=${wpPassword} \
      --admin_email=${wpEmail}`, (error, stdout, stderr) => {
      if (error || stderr) {
        error && console.log(`error: ${error.message}`);
        stderr && console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });

    // run Evolve theme install
    console.log('Setting up Evolve API...')
    execSync(`docker run --rm --user 33 --volumes-from ${projectContainerName}_wordpress \
      --network container:${projectContainerName}_wordpress \
      wordpress:cli wp theme activate evolve`, (error, stdout, stderr) => {
      if (error || stderr) {
        error && console.log(`error: ${error.message}`);
        stderr && console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });


    // Install Advanced Custom Fields
    execSync(`docker run --rm --user 33 --volumes-from ${projectContainerName}_wordpress \
      --network container:${projectContainerName}_wordpress \
      wordpress:cli wp plugin install https://downloads.wordpress.org/plugin/advanced-custom-fields.5.9.5.zip`, (error, stdout, stderr) => {
      if (error || stderr) {
        error && console.log(`error: ${error.message}`);
        stderr && console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });

    // Activate Advanced Custom Fields
    execSync(`docker run --rm --user 33 --volumes-from ${projectContainerName}_wordpress \
      --network container:${projectContainerName}_wordpress \
      wordpress:cli wp plugin activate advanced-custom-fields`, (error, stdout, stderr) => {
      if (error || stderr) {
        error && console.log(`error: ${error.message}`);
        stderr && console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });

    // Activate Evolve Api
    execSync(`docker run --rm --user 33 --volumes-from ${projectContainerName}_wordpress \
      --network container:${projectContainerName}_wordpress \
      wordpress:cli wp plugin activate evolve-api`, (error, stdout, stderr) => {
      if (error || stderr) {
        error && console.log(`error: ${error.message}`);
        stderr && console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });

    // Update permalinks structure
    execSync(`docker run --rm --user 33 --volumes-from ${projectContainerName}_wordpress \
      --network container:${projectContainerName}_wordpress \
      wordpress:cli wp rewrite structure '/%postname%/'`, (error, stdout, stderr) => {
      if (error || stderr) {
        error && console.log(`error: ${error.message}`);
        stderr && console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });

    // bootstrap new next app from evolve-next-starter repo 
    console.log('Setting up Evolve client...') 
    exec(`cd ${formattedProjectName};\
      npm i create-next-app; npx create-next-app ${formattedProjectName}-client \
          -e https://github.com/kento-mc/evolve-next-starter`, (error, stdout, stderr) => {
      if (error || stderr) {
        error && console.log(`error: ${error.message}`);
        stderr && console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });

    // create client image
    break;
  case 'run':
    projectsData = fs.readFileSync(path.resolve(__dirname, 'projects.json'));
    projects = JSON.parse(projectsData);

    switch (process.argv[3]) {
      case undefined:
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
        break;
      case projects.includes(process.argv[3]):
        console.log(`Launching ${process.argv[3]} project`);
        // spin up project
        break;
      default:
        console.log('no such project');
        break;
    };
    break;
  case 'list':
    // display list of evolve projects
    projectsData = fs.readFileSync(path.resolve(__dirname, 'projects.json'));
    projects = JSON.parse(projectsData);

    console.log('\nEvolve projects');
    projects.forEach((project, i) => {
      console.log(`  ${i+1}) ${project.name}`)
    });
    console.log('\nEnter prjoject number for more options');
    const option = prompt('====> ');
    // TODO finish options
    console.log(`\nYou chose option ${option}`)
    break;
  case 'pwd':
    
  default:
    console.log(`command "${process.argv[2]}" not recognized!`);
    break;
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