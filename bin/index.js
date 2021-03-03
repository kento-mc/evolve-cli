#!/usr/bin/env node

const projects = ['hurka'];

if (typeof process.argv[2] === 'undefined') {
  console.log('you are evolving');
} else if (process.argv[2] === 'new') {
  console.log('something new!');
  // check for/install docker & docker-compose
  // evolve give project a name
  // evolve specify desired backend and client ports
  // copy files
  // create client image
} else if (process.argv[2] === 'run') {
  if (typeof process.argv[3] === 'undefined') {
    console.log('list of projects');
    // display list of evolve projects
  } else if (projects.includes(process.argv[3])) {
    console.log(`Launching ${process.argv[3]} project`);
    // spin up project
  } else {
    console.log('no such project');
  };
} else {
  console.log(`command "${process.argv[2]}" not recognized!`);
};


// spin up containers
// wp cli install wordpress
// evolve child enter theme details
// wp scaffold child-theme
// wp cli install/activate theme/plugin
// initialize next
// launch browser windows