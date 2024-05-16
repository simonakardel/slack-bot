import { type Handler, schedule } from '@netlify/functions';
import { blocks, slackApi, createButton } from './util/slack';

const postDailyStandupReminder: Handler = async () => {
    await slackApi('chat.postMessage', {
        channel: 'C06NUPMAHCY',
        text: "It's time for your daily standup!",
        blocks: [
            blocks.section({
                text: "Good morning team! :sunrise: Please take a moment to share your updates in today's standup.",
            }),
            blocks.actions([
                createButton("Open Standup Modal", "open_standup_modal", "standup", "primary")
            ]),
        ],
    });

    return {
        statusCode: 200,
    };
};


export const handler = schedule('* * * * *', postDailyStandupReminder);
