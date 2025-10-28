const SETTINGS_KEY = "whitehat_conference_settings";

export interface ConferenceSettings {
  conferenceName: string;
  villageName: string;
  conferenceDate: string;
  conferenceUrl: string;
}

const defaultSettings: ConferenceSettings = {
  conferenceName: "WhiteHatDesert Conference 2025",
  villageName: "Hospitalizing Malware Village",
  conferenceDate: "15th November 2025",
  conferenceUrl: "https://whitehatdesert.com",
};

export const getConferenceSettings = (): ConferenceSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : defaultSettings;
};

export const saveConferenceSettings = (settings: ConferenceSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
