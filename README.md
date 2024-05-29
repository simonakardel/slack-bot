# Slack Bot for Developers

This project is a Slack bot integrated with Notion to automate daily tasks for developers. The bot was inspired by my internship at NordInsight, where we used Slack and Notion for our daily communication. It includes slash commands to report bugs, conduct stand-ups, and request code reviews, simplifying and streamlining developer workflows.

## Features

- **Bug Reporting**: Easily report bugs using the `/bugreport` command, providing details about the issue, its severity, and steps to reproduce it.
- **Stand-Up Reports and Daily Reminders**: Share daily progress and blockers using the `/standup` command. This command opens a modal to fill in details about what you worked on, what you are currently working on, your next tasks, and any issues you're facing. A scheduler sends a reminder every day at 10am, prompting developers to complete their stand-up reports. All reports are automatically saved in the Notion stand-up database, ensuring that progress updates are timely and consistent.
- **Code Review Requests**: Request code reviews with the `/requestreview` command. Developers can enter the review title, description, and a GitHub link to the relevant code.

## Installation and Setup

To install, set up, and run the Slack bot, follow these steps:

### Clone and Install

1. **Clone the repository**:
    ```sh
    git clone https://github.com/simonakardel/slack-bot
    cd slack-bot
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

### Environment Variables

3. **Set up environment variables**: Create a `.env` file in the root directory and add the following environment variables:
    ```
    NOTION_SECRET=your_notion_secret
    NOTION_DATABASE_ID=your_notion_database_id
    NOTION_BUG_DATABASE_ID=your_bug_database_id
    NOTION_CODE_REVIEW_DATABASE_ID=your_code_review_database_id
    NOTION_STANDUP_DATABASE_ID=your_standup_database_id
    SLACK_BOT_OAUTH_TOKEN=your_slack_bot_oauth_token
    SLACK_SIGNING_SECRET=your_slack_signing_secret
    ```

### Notion Setup

4. **Set up Notion databases**: Ensure you have three different databases set up in Notion for bug reports, code reviews, and stand-up reports. Copy the database IDs and add them to your environment variables as shown above.

### Slack Bot Setup

5. **Set up the Slack bot**:
    - Go to the Slack API [App Directory](https://api.slack.com/apps) and create a new app.
    - Enable the "Bot" scope and add the required permissions.
    - Install the app to your Slack workspace and obtain the OAuth token.
    - Add the bot to the relevant Slack channels.

### Deployment

6. **Deploy to Netlify**:
    - Connect your GitHub repository to Netlify.
    - Set the environment variables in the Netlify dashboard under Site Settings > Build & Deploy > Environment.
    - Deploy the site.

### Local Development

If you prefer to run the bot locally for development purposes:

7. **Start the development server**:
    ```sh
    npm run dev
    ```

## Usage

Once the bot is set up and running, you can use the following commands in Slack:

### Bug Report

To report a bug, use the `/bugreport` command in Slack. A modal will open where you can enter the bug details, severity, and steps to reproduce.

### Stand-Up Report

To submit a stand-up report, use the `/standup` command in Slack. A modal will open where you can enter your progress, planned tasks, blockers, and additional notes.

### Request Review

To request a code review, use the `/requestreview` command in Slack. A modal will open where you can enter the review title, description, and a link to the code.

## Configuration

Ensure you have the correct environment variables set up to connect to your Slack workspace and Notion workspace. The bot uses these variables to authenticate and interact with the APIs.

## Dependencies

- `@netlify/functions`: Used to handle serverless functions on Netlify.

## Examples

### Bug Report

To report a bug, use the `/bugreport` command in Slack. A modal will open where you can enter the bug details, severity, and steps to reproduce.

### Stand-Up Report

To submit a stand-up report, use the `/standup` command in Slack. A modal will open where you can enter your progress, planned tasks, blockers, and additional notes.

### Request Review

To request a code review, use the `/requestreview` command in Slack. A modal will open where you can enter the review title, description, and a link to the code.


