export async function notionApi(endpoint: string, body: {}){
    const res = await fetch(`https://api.notion.com/v1${endpoint}`, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${process.env.NOTION_SECRET}`,
            'Notion-Version': '2022-06-28',
            'content-type': 'application/json',
        },
        body: JSON.stringify(body),
    }).catch(err => console.error(err));

    if (!res || !res.ok) {
        console.error(res);
    }

    const data = await res?.json();
    return data;
}

export async function saveItem(item: NewItem) {
    const res = await notionApi('/pages', {
        parent: {
            database_id: process.env.NOTION_DATABASE_ID,
        },
        properties: {
            opinion: {
                title: [{ text: { content: item.opinion }}],
            },
            spiceLevel: {
                select: {
                    name: item.spiceLevel,
                }
            },
            submitter: {
                rich_text: [{ text: { content: `@${item.submitter} on Slack`}}]
            }
        }
    })

    if (!res.ok) {
		console.log(res);
	}
}

// SAVING BUG INTO NOTION DATABASE
export async function saveBugReport(bugReport: BugReport) {
    const res = await notionApi('/pages', {
        parent: {
            database_id: process.env.NOTION_BUG_DATABASE_ID, 
        },
        properties: {
            'Status': {
                select: {
                    name: 'New',
                },
            },
            'Bug Description': {
                title: [{ text: { content: bugReport.description }}],
            },
            'Severity Level': {
                select: {
                    name: bugReport.severity,
                },
            },
            'Reproduction Steps': {
                rich_text: [{ text: { content: bugReport.reproductionSteps }}],
            },
            'Reporter': {
                rich_text: [{ text: { content: `@${bugReport.reporter} on Slack`}}],
            },
        },
    });

    if (!res.ok) {
        console.error('Error saving bug report to Notion:', res);
    }

    return res;
}

// SAVING REQUESTED REVIEW INTO NOTION DATABASE
export async function saveRequestedReview(requestedReview: RequestedReview) {
    const res = await notionApi('/pages', {
        parent: {
            database_id: process.env.NOTION_CODE_REVIEW_DATABASE_ID, 
        },
        properties: {
            'Status': {
                select: {
                    name: 'New',
                },
            },
            'Review Title': {
                title: [{ text: { content: requestedReview.title }}],
            },
            'Review Description': {
                rich_text: [{ text: { content: requestedReview.description }}],
            },
            'Review Link': {
                url: requestedReview.link, 
            },
            'Reporter': {
                rich_text: [{ text: { content: `@${requestedReview.reporter} on Slack`}}],
            },
        },
    });

    if (res.object === 'error') {
        console.error('Error saving a review request to Notion:', res);
    } else {
        console.log("Success")
    }

    return res;
}

// SAVING STANDUP REPORT INTO NOTION DATABASE
export async function saveStandupReport(standupReport: StandupReport) {
    const res = await notionApi('/pages', {
        parent: {
            database_id: process.env.NOTION_STANDUP_DATABASE_ID, 
        },
        properties: {
            'Date': {
                date: {
                    start: standupReport.date,
                },
            },
            'Yesterday\'s task': {
                rich_text: [{ text: { content: standupReport.yesterdayTasks }}],
            },
            'Today\'s Task': {
                rich_text: [{ text: { content: standupReport.todayTasks }}],
            },
            'Blockers': {
                rich_text: [{ text: { content: standupReport.blockers }}],
            },
            'Additional Notes': {
                rich_text: [{ text: { content: standupReport.additionalNotes }}],
            },
            'Team Member': {
                title: [{ text: { content: standupReport.reporter }}],
            },
        },
    });

    if (res.object === 'error') {
        console.error('Error saving a review request to Notion:', res);
    } else {
        console.log("Success")
    }

    return res;
}

