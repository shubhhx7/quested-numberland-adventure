type EventName =
  | 'onboarding_completed'
  | 'mission_started'
  | 'hint_used'
  | 'answer_submitted'
  | 'mission_completed'
  | 'dashboard_viewed'
  | 'progress_report_copied'
  | 'progress_reset';

export function trackEvent(eventName: EventName, payload?: Record<string, unknown>): void {
  console.log(`[QuestED Analytics] ${eventName}`, payload ?? {});
}
