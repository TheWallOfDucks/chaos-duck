export interface IDuckConfig {
    account: string;
    chaosUrl?: string;
    emailFrom?: string;
    emailTo?: string;
    environment?: string;
    profile?: string;
    role: string;
    schedule?: string;
    services?: string;
    slackWebhookUrl?: string;
    stage?: string;
}
