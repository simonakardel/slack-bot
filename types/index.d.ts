type SlackSlashCommandPayload = {
	token: string;
	team_id: string;
	team_domain: string;
	channel_id: string;
	channel_name: string;
	user_id: string;
	user_name: string;
	command: string;
	text: string;
	api_app_id: string;
	is_enterprise_install: boolean;
	response_url: string;
	trigger_id: string;
	payload: never;
};

type SlackInteractivityPayload = {
	payload: string;
	command: never;
};

type SlackPayload = SlackSlashCommandPayload | SlackInteractivityPayload;

type SlackBlockSection = {
	type: 'section';
	text: {
		type: 'plain_text' | 'mrkdwn';
		text: string;
		verbatim?: boolean;
	};
};

type SlackBlockInput = {
	type: 'input';
	block_id: string;
	label: {
		type: 'plain_text';
		text: string;
		emoji?: boolean;
	};
	hint?: {
		type: 'plain_text';
		text: string;
		emoji?: boolean;
	};
	optional?: boolean;
	dispatch_action?: boolean;
	element: {
		type: string;
		action_id: string;
		placeholder?: {
			type: string;
			text: string;
			emoji?: boolean;
		};
		options?: {
			text: {
				type: 'plain_text';
				text: string;
				emoji?: boolean;
			};
			value: string;
		}[];
		initial_value?: string;
		dispatch_action_config?: {
			trigger_actions_on: string[];
		};
	};
};

type SlackBlock = SlackBlockSection | SlackBlockInput;

type FoodOpinionModalState = {
	values: {
		opinion_block: {
			opinion: {
				type: 'plain_text_input';
				value: string;
			};
		};
		spice_level_block: {
			spice_level: {
				type: 'static_select';
				selected_option: {
					text: {
						type: 'plain_text';
						text: string;
						emoji: boolean;
					};
					value: string;
				};
			};
		};
	};
};

type ModalArgs = {
	trigger_id: string;
	id: string;
	title: string;
	submit_text?: string;
    submit?: {
        type: string;
        text: string;
    };
	blocks: SlackBlock[];
};

type SlackModalPayload = {
	type: string;
	callback_id?: string;
	team: {
		id: string;
		domain: string;
	};
	user: {
		id: string;
		username: string;
		name: string;
		team_id: string;
	};
	channel?: {
		id: string;
		name: string;
	};
	message: {
		ts: string;
		thread_ts?: string;
	};
	api_app_id: string;
	token: string;
	trigger_id: string;
	view: {
		id: string;
		team_id: string;
		type: string;
		blocks: SlackBlock[];
		private_metadata: string;
		callback_id: string;
		state: FoodOpinionModalState;
		hash: string;
		title: {
			type: 'plain_text';
			text: string;
			emoji: boolean;
		};
		clear_on_close: boolean;
		notify_on_close: boolean;
		close: null;
		submit: {
			type: 'plain_text';
			text: string;
			emoji: boolean;
		};
		app_id: string;
		external_id: string;
		app_installed_team_id: string;
		bot_id: string;
	};
};

type InteractiveMessagePayload = {
    type: 'block_actions';
    user: {
        id: string;
        username: string;
        name: string;
        team_id: string;
    };
    channel: {
        id: string;
        name: string;
    };
    message: {
        ts: string;
        thread_ts?: string;
    };
    actions: Action[];
    trigger_id: string;
    response_url: string;
    team: {
        id: string;
        domain: string;
    };
};

type Action = {
    action_id: string;
    block_id: string;
    value?: string;
    type: string;
    action_ts: string;
};


type SlackApiEndpoint = 'chat.postMessage' | 'views.open';

type SlackApiRequestBody = {};

type BlockArgs = {
	id: string;
	label: string;
	placeholder: string;
};

type SectionBlockArgs = {
	text: string;
};

type InputBlockArgs = {
	initial_value?: string;
	hint?: string;
} & BlockArgs;

type SelectBlockArgs = {
	options: {
		label: string;
		value: string;
	}[];
} & BlockArgs;

type ButtonElement = {
    type: 'button';
    text: {
        type: 'plain_text';
        text: string;
        emoji?: boolean;
    };
    action_id: string;
    value?: string;
    style?: 'danger' | 'primary';
}

/*
type NotionItem = {
	properties: {
		opinion: {
			title: {
				text: {
					content: string;
				};
			}[];
		};
		spiceLevel: {
			select: {
				name: string;
			};
		};
		Status: {
			status: {
				name: string;
			};
		};
	};
}; */

type NewItem = {
	opinion: string;
	spiceLevel: string;
	status?: string;
	submitter?: string;
};

type BugReport = {
    description: string;
    severity: string;
    reproductionSteps: string;
    reporter: string;
    status: string;
};

type RequestedReview = {
	title: string,
    description: string;
	link: string;
	reporter: string;
    status: string;
};

type StandupReport = {
    yesterdayTasks: string;
    todayTasks: string;
    blockers: string;
    additionalNotes: string; 
    reporter: string; 
    date: string; 
};

