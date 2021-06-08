A simple CLI tool to simplify the process of moving from a Wordpress website to a modern Next.js web app using Wordpress as a headless CMS.

The CLI tool bootstraps a basic local implementation of necessary Docker containers and network configuration and sets up starter repos for the Wordpress backend and Next.js client.

### Usage

After installing the CLI, getting started with this technology stack is then as simple as running a single command:

```bash
evolve new
```

The user is then prompted to give their project a name and it creates two directories for the backend and frontend repositories and installs the necessary dependencies. The user is then prompted for user credentials for the Wordpress installation - username, password, and email address.

And that’s it! The user can then view the new frontend client at localhost:3000.

The user can navigate to the backend CMS at localhost:8000/wp-admin and log into the Wordpress Admin dashboard. They will see a section for the Evolve custom post type, where they can add a post.

When they return to the client page and refresh they will see data returned from the post that has just been added in the CMS
