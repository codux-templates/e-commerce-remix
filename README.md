# eCommerce Starter Project

Welcome to our eCommerce Starter project! This is an online shopping platform that uses Wix Headless as the back office for managing the store. This project is designed to be your stepping stone to creating your own online store. It's simple, straightforward, and combines various technologies.

## Project Overview

This project is more than just an example - it's a starter. The main goal here is to empower you to build your own store. You can set up your store on Wix Headless, manage your products, payments, deliveries, and more. Feel free to modify the design or the application however you see fit!

## Technologies Used

- **Wix eComm, Redirects, SDK, Stores**: Wix libraries used for various CMS functionalities in the app.
- **Remix**: React framework for server-side rendering and routing.
- **Vite**: Serves as the front-end development environment.
- **Classnames**: Assists in assigning multiple classes to elements.
- **SWR**: Handles caching content in the client app, fetching new content periodically, and providing a simple API between the content cache and React components.
- **Sass**: Facilitates writing scoped CSS.
- **Faker**: Generates mock content for boards and tests.
- **Radix-UI React Icons**: Used for adding icons to the app.
- **JS Cookie**: A simple, lightweight JS API for handling cookies.

## Getting Started

1. Clone the repository in Codux and run the automated installation script.
1. Create your [Wix Headless](https://dev.wix.com/docs/go-headless/getting-started/setup/general-setup/create-a-project) project and copy your client ID from Settings > Headless Settings > OAuth apps.
1. Copy and Rename [.env.template](./.env.template) to `.env`
1. Replace the current key in the newly created `.env` file in Codux with your headless site client ID.
1. Replace the current key in the [Codux Config](./codux.config.json) file in `previewConfiguration > environmentVariables` section with your headless site client ID.

Now all you have to do is deploy your Remix app and manage your store through Wix!

## Advanced features

### Product categories

You may categorize your products on a headless CMS back-office. Once product categories are added, they will appear on product category page in filter section.

You may also want to add a link to a particular category directly to site header, in this case, please add this code snippet to a [header](./src/components/header/header.tsx) file:

```
    <NavLink
        to={ROUTES.category.to('my-category')}
        className={({ isActive }) =>
            classNames(styles.menuButton, { [styles.activeMenuItem]: isActive })
        }
    >
        My Category
    </NavLink>
```

and replace `my-category` with your existing category name.

## Using Test Data

Most of our boards are wrapped in a context provider that returns mock data (using Faker) instead of fetching it from Wix Headless. We do this for a few reasons:

- It allows us to test and design components without adding data in Wix Headless (or anywhere else).
- It allows us to create boards for different scenarios: very long text, very short text, different numbers of items, etc.
- We can use our boards in tests.

## Board Templates

Boards often require a rendering environment that serves as a context for components, providing the necessary wrappers for data providers, routers, and styles that are external to the component itself. This environment ensures that all components can be visually edited and interacted with as intended. Codux empowers users to create [custom templates](https://help.codux.com/kb/en/article/kb26227) for their projects, which serve as a foundation for new boards. These board templates are designed to include all the essential elements a user might need, ensuring consistency and adherence to design intentions.

The project comes with 5 board templates that include connections to test data or real data, and components or pages.

Happy coding!
