import type { Handler } from '@netlify/functions';
import { parse } from 'querystring';
import { slackApi, verifySlackRequest, blocks, modal } from './util/slack';
import {
    saveBugReport,
    saveRequestedReview,
    saveStandupReport,
} from './util/notion';

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
    switch (payload.command) {
        case '/reportbug':
            const response = await slackApi(
                'views.open',
                modal({
                    id: 'bug-report-modal',
                    title: 'Report a Bug',
                    trigger_id: payload.trigger_id,
                    blocks: [
                        blocks.input({
                            id: 'bug_description',
                            label: 'Bug Description',
                            placeholder: 'Describe the bug...',
                            hint: 'Please describe the bug',
                        }),
                        blocks.select({
                            id: 'bug_severity',
                            label: 'Severity Level',
                            placeholder: 'Select severity level',
                            options: [
                                { label: 'Critical', value: 'critical' },
                                { label: 'High', value: 'high' },
                                { label: 'Medium', value: 'medium' },
                                { label: 'Low', value: 'low' },
                            ],
                        }),
                        blocks.input({
                            id: 'reproduction_steps',
                            label: 'Steps to Reproduce',
                            placeholder: 'Steps to reproduce the bug...',
                            hint: 'How did this happen?',
                        }),
                    ],
                }),
            );

            if (!response.ok) {
                console.error('Error opening bug report modal:', response);
            }
            break;

        case '/requestreview':
            const res = await slackApi(
                'views.open',
                modal({
                    id: 'request-review-modal',
                    title: 'Request a Code Review',
                    trigger_id: payload.trigger_id,
                    blocks: [
                        blocks.input({
                            id: 'review_title',
                            label: 'Code title',
                            placeholder: 'Title',
                            hint: 'What did you work on?',
                        }),
                        blocks.input({
                            id: 'review_description',
                            label: 'Description',
                            placeholder: 'Describe the code...',
                            hint: 'Please describe the code needed to be reviewed',
                        }),
                        blocks.input({
                            id: 'github_link',
                            label: 'GitHub Link',
                            placeholder: 'GitHub Link',
                            hint: 'Paste the link',
                        }),
                    ],
                }),
            );

            if (!res.ok) {
                console.error('Error opening request review modal:', res);
            }
            break;

        case '/standup':
            const standupRes = await slackApi('views.open', buildStandupModal(payload.trigger_id));
            if (!standupRes.ok) {
                console.error('Error opening standup modal:', standupRes);
            }
            break;

        default:
            return {
                statusCode: 200,
                body: 'Command not recognized',
            };
    }
    return {
        statusCode: 200,
        body: '',
    };
}

async function handleInteractivity(
    payload: SlackModalPayload | InteractiveMessagePayload,
) {
    if ('actions' in payload && payload.type === 'block_actions') {
        const action = payload.actions[0];
        if (action.action_id === 'open_standup_modal') {
            await slackApi('views.open', buildStandupModal(payload.trigger_id));
        }
    }

    else if ('view' in payload && payload.type === 'view_submission') {
        const callback_id = payload.callback_id ?? payload.view.callback_id;
        let data: any;

        switch (callback_id) {
            case 'bug-report-modal':
                console.log('Handling bug report submission');
                data = payload.view.state.values as any;

                const bugReport = {
                    description:
                        data.bug_description_block.bug_description.value,
                    severity:
                        data.bug_severity_block.bug_severity.selected_option
                            .value,
                    reproductionSteps:
                        data.reproduction_steps_block.reproduction_steps.value,
                    reporter: payload.user.name,
                    status: 'New',
                };

                await saveBugReport(bugReport);

                await slackApi('chat.postMessage', {
                    channel: payload.user.id,
                    text: `Thank you for reporting the bug. Your report has been successfully logged. \n\n*Bug Description:* ${bugReport.description} \n*Severity:* ${bugReport.severity}`,
                });
                break;

            case 'request-review-modal':
                console.log('Handling request review submission');
                data = payload.view.state.values as any;

                const requestedReview = {
                    title: data.review_title_block.review_title.value,
                    description:
                        data.review_description_block.review_description.value,
                    link: data.github_link_block.github_link.value,
                    reporter: payload.user.name,
                    status: 'New',
                };

                await saveRequestedReview(requestedReview);

                await slackApi('chat.postMessage', {
                    channel: payload.user.id,
                    text: `Thank you for submitting a request for code review! \n\n*Review Title:* ${requestedReview.title} \n*GitHub:* ${requestedReview.link}`,
                });

                break;

            case 'standup-modal':
                console.log('Handling standup submission');
                data = payload.view.state.values as any;

                const standup = {
                    yesterdayTasks:
                        data.yesterday_tasks_block.yesterday_tasks.value,
                    todayTasks: data.today_tasks_block.today_tasks.value,
                    blockers: data.blockers_block.blockers.value,
                    additionalNotes:
                        data.additional_notes_block?.additional_notes.value ||
                        'None', 
                    reporter: payload.user.name,
                    date: new Date().toISOString().split('T')[0], 
                };

                await saveStandupReport(standup);

                await slackApi('chat.postMessage', {
                    channel: payload.user.id,
                    text: `Thank you for your stand-up submission! \n\n*Yesterday's Tasks:* ${standup.yesterdayTasks} \n*Today's Tasks:* ${standup.todayTasks} \n*Blockers:* ${standup.blockers} \n*Additional Notes:* ${standup.additionalNotes}`,
                });

                break;

            default:
                console.warn(`No handler defined for ${payload.view.callback_id}`);
                return {
                    statusCode: 400,
                    body: `No handler defined for ${payload.view.callback_id}`,
                };
        }
    }

    return {
        statusCode: 200,
        body: '',
    };
}

export const handler: Handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const valid = verifySlackRequest(event);

    if (!valid) {
        console.error('Invalid request');

        return {
            statusCode: 400,
            body: 'invalid request',
        };
    }

    const body = parse(event.body ?? '') as SlackPayload;
    if (body.command) {
        return handleSlashCommand(body as SlackSlashCommandPayload);
    }

    if (body.payload) {
        const payload = JSON.parse(body.payload);
        return handleInteractivity(payload);
    }
    console.warn('Unhandled event type:', event);
    return {
        statusCode: 200,
        body: 'TODO: handle Slack commands and interactivity',
    };
};

function buildStandupModal(trigger_id: string): any {
    return  modal({
        id: 'standup-modal',
        title: 'Share your progress!',
        trigger_id: trigger_id,
        blocks: [
            blocks.input({
                id: 'yesterday_tasks',
                label: 'What did you work on yesterday?',
                placeholder: 'List your tasks...',
                hint: 'Describe what you worked on yesterday...',
            }),
            blocks.input({
                id: 'today_tasks',
                label: 'What will you work on today?',
                placeholder: 'List your planned tasks...',
                hint: 'Describe what your next steps are going to be...',
            }),
            blocks.input({
                id: 'blockers',
                label: 'Any blockers?',
                placeholder: 'Describe any obstacles...',
                hint: 'Is there something you are struggling with?',
            }),
            blocks.input({
                id: 'additional_notes',
                label: 'Additional Notes',
                placeholder: 'Any other comments or notes?',
                hint: 'Comments',
            }),

        ],
    });
}
